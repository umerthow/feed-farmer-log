import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { UserReceipt } from "@/types/receipt";
import { useCategoriesAndIngredients } from "@/hooks/useCategoriesAndIngredients";
import ErrorDialog from "./ui/ErrorDialog";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/api/supabase";
import { useReceipts } from "@/hooks/use-receipts";
import LoadingSpinner from "./ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

// type Receipt = {
//   id: string;
//   name: string;
//   pricePerKg: number;
//   fedKg: number;
//   fedPercent: number;
//   price: number;
//   ingredients: ReceiptIngredient[];
// };

// type ReceiptIngredient = {
//   id: string;
//   name: string;
//   quantity: number;
// };

// const initialReceipts: Partial<UserReceipt>[] = [
//   {
//     id: "1",
//     user_id: "F38jUkFc6lXkttiWQVKVsjEeIFI2",
//     name: "Dairy Cow Mix",
//     ingredients: [
//       {
//         ingredient_id: 1,
//         ingredient_category_id: 2,
//         Name: "Corn",
//         price_per_kilos: 3200,
//         kilos: 67,
//         create_at: new Date(),
//         update_at: new Date(),
//       },
//       {
//         ingredient_id: 2,
//         ingredient_category_id: 1,
//         Name: "Bekatul",
//         price_per_kilos: 5000,
//         kilos: 12,
//         create_at: new Date(),
//         update_at: new Date(),
//       },
//     ],
//   },
// ];

const Receipts = () => {
  const { categories, ingredients } = useCategoriesAndIngredients();
  const { currentUser } = useAuth();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<UserReceipt | null>(
    null
  );
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<UserReceipt | null>(null);
  const [currentIngredient, setCurrentIngredient] = useState<any>(null);
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);

  // Helper to show error
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorDialogOpen(true);
  };

  // Fetch receipts for the current user
  const { receipts, setReceipts, loading } = useReceipts(
    currentUser,
    ingredients,
    showError
  );

  if (loading) return <LoadingSpinner message="Loading receipts..." />;

  const handleAddNew = () => {
    setCurrentReceipt({
      id: Date.now().toString(),
      user_id: currentUser.uid, // set as needed
      receipt_name: "",
      ingredients: [],
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (receipt: UserReceipt) => {
    setToDelete(receipt);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (receipt: UserReceipt) => {
    setCurrentReceipt({ ...receipt, ingredients: [...receipt.ingredients] });
    setIsDialogOpen(true);
  };


  const handleSave = async () => {
    if (!currentReceipt) return;
    if (receipts.some((r) => r.id === currentReceipt.id)) {
      setReceipts(
        receipts.map((r) => (r.id === currentReceipt.id ? currentReceipt : r))
      );
    } else {
      setReceipts([...receipts, currentReceipt]);
    }

    // Insert to user_receipts
    const { data: receipt, error } = await supabase
      .from("user_receipts")
      .insert([
        {
          user_id: currentReceipt.user_id,
          receipt_name: currentReceipt.receipt_name,
        },
      ])
      .select()
      .single();
    if (error) {
      showError("Error add receipt: " + error.message);
    }

    // Insert details
    const details = currentReceipt.ingredients.map((ing) => ({
      ingredient_id: ing.ingredient_id,
      price_per_kilos: ing.price_per_kilos,
      kilos: ing.kilos,
      ingredient_category_id: ing.ingredient_category_id,
      user_receipt_id: receipt.id,
    }));
    const { error: detailError } = await supabase
      .from("user_receipts_detail")
      .insert(details);
    if (detailError) return showError(detailError.message);

    toast({
      title: 'Success',
      description: 'You have successfully create new receipt: ' + currentReceipt.receipt_name,
    });

    setIsDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!toDelete) return;
    const { error } = await supabase
      .from("user_receipts")
      .delete()
      .eq("id", toDelete.id);
    if (error) {
      showError("Error deleting receipt: " + error.message);
    } else {
      setReceipts(receipts.filter((r) => r.id !== toDelete.id));
    }
    setDeleteDialogOpen(false);
    setToDelete(null);
  };

  const handleInputChange = (field: keyof UserReceipt, value: string) => {
    if (!currentReceipt) return;
    setCurrentReceipt({ ...currentReceipt, [field]: value });
  };

  const handleAddIngredient = () => {
    setCurrentIngredient({
      ingredient_id: "",
      Name: "",
      price_per_kilos: 0,
      kilos: 0,
      create_at: new Date(),
      update_at: new Date(),
    });
    setIsIngredientDialogOpen(true);
  };

  const handleSaveIngredient = () => {
    if (
      !currentReceipt ||
      !currentIngredient ||
      !currentIngredient.ingredient_category_id ||
      !currentIngredient.ingredient_id
    ) {
      <ErrorDialog
        open={errorDialogOpen}
        message="Data Not Found"
        onClose={() => setErrorDialogOpen(false)}
      />;
      return;
    }

    // Ensure IDs are numbers
    const ingredientToAdd = {
      ...currentIngredient,
      ingredient_category_id: Number(currentIngredient.ingredient_category_id),
      ingredient_id: Number(currentIngredient.ingredient_id),
      create_at: new Date(),
      update_at: new Date(),
    };

    setCurrentReceipt({
      ...currentReceipt,
      ingredients: [...currentReceipt.ingredients, ingredientToAdd],
    });
    setIsIngredientDialogOpen(false);
    setCurrentIngredient(null); // Reset after adding
  };

  const handleRemoveIngredient = (ingredient_id: number) => {
    if (!currentReceipt) return;
    setCurrentReceipt({
      ...currentReceipt,
      ingredients: currentReceipt.ingredients.filter(
        (i) => i.ingredient_id !== ingredient_id
      ),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <Button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Receipt
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead colSpan={3} className="p-0">
                Details
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">
                  {receipt.receipt_name}
                </TableCell>
                <TableCell colSpan={4} className="p-0">
                  <Table className="w-full border-none">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price per kg</TableHead>
                        <TableHead>Quantity (kg)</TableHead>
                        <TableHead>Total Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receipt.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.ingredient_id}>
                          <TableCell>{ingredient.Name}</TableCell>
                          <TableCell>
                            {ingredient.price_per_kilos.toLocaleString(
                              "id-ID",
                              { style: "currency", currency: "IDR" }
                            )}
                          </TableCell>
                          <TableCell>{ingredient.kilos}</TableCell>
                          <TableCell>
                            {(
                              ingredient.price_per_kilos * ingredient.kilos
                            ).toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell className="text-right align-top">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(receipt)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(receipt)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentReceipt &&
              receipts.some((r) => r.id === currentReceipt.id)
                ? "Edit Receipt"
                : "Add New Receipt"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentReceipt?.receipt_name || ""}
                onChange={(e) =>
                  handleInputChange("receipt_name", e.target.value)
                }
              />
            </div>
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Ingredients</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price per kg</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReceipt?.ingredients.map((ingredient) => (
                    <TableRow key={ingredient.ingredient_id}>
                      <TableCell>{ingredient.Name}</TableCell>
                      <TableCell>{ingredient.price_per_kilos}</TableCell>
                      <TableCell>{ingredient.kilos}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveIngredient(ingredient.ingredient_id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isIngredientDialogOpen}
        onOpenChange={setIsIngredientDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ingredient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    ingredient_category_id: value,
                    ingredient_id: "", // reset ingredient when category changes
                  })
                }
                value={currentIngredient?.ingredient_category_id || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ingredient">Ingredient</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    ingredient_id: value,
                    Name:
                      ingredients.find((i) => i.ID === Number(value))?.Name ||
                      "",
                  })
                }
                value={currentIngredient?.ingredient_id || ""}
                disabled={!currentIngredient?.ingredient_category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map((ingredient) => (
                    <SelectItem key={ingredient.ID} value={ingredient.ID}>
                      {ingredient.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price_per_kilos">Price per kg</Label>
              <Input
                id="price_per_kilos"
                type="number"
                value={currentIngredient?.price_per_kilos || 0}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    price_per_kilos: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="kilos">Quantity (kg)</Label>
              <Input
                id="kilos"
                type="number"
                value={currentIngredient?.kilos || 0}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    kilos: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsIngredientDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveIngredient}
              className="bg-green-600 hover:bg-green-700"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Receipt</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <b>{toDelete?.receipt_name}</b>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ErrorDialog
        open={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
    </div>
  );
};

export default Receipts;
