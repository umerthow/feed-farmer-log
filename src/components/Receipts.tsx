import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2, EyeIcon } from "lucide-react";
import { UserReceipt } from "@/types/receipt";
import { useCategoriesAndIngredients } from "@/hooks/useCategoriesAndIngredients";
import ErrorDialog from "./ui/ErrorDialog";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/api/supabase";
import { useReceipts } from "@/hooks/use-receipts";
import LoadingSpinner from "./ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ReceiptForm from "@/components/receipts/ReceiptForm";

const Receipts = () => {
  const { categories, ingredients } = useCategoriesAndIngredients();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
  const { receipts, setReceipts, loading, fetchReceipts } = useReceipts(
    currentUser,
    ingredients,
    showError
  );

  if (loading) return <LoadingSpinner message="Loading receipts..." />;

  const handleAddNew = () => {
    setCurrentReceipt({
      id: Date.now().toString(),
      user_id: currentUser.uid, // set as needed
      updated_at:  new Date(),
      receipt_name: "",
      created_at: new Date(),
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

  const updateReceipt = async (receiptId, updatedReceipt) => {
    const { error } = await supabase
      .from("user_receipts")
      .update({
        receipt_name: updatedReceipt.receipt_name,
        updated_at: new Date().toISOString(), // Update timestamp
      })
      .eq("id", receiptId);
  
    if (error) {
      console.error("Error updating user_receipts:", error.message);
      return false;
    }
  
    return true;
  };

  const updateReceiptDetails = async (receiptId, updatedDetails) => {
    // Delete existing details for the receipt
    const { error: deleteError } = await supabase
      .from("user_receipts_detail")
      .delete()
      .eq("user_receipt_id", receiptId);
  
    if (deleteError) {
      console.error("Error deleting user_receipts_detail:", deleteError.message);
      return false;
    }
  
    // Insert updated details
    const { error: insertError } = await supabase
      .from("user_receipts_detail")
      .insert(
        updatedDetails.map((detail) => ({
          ingredient_category_id: detail.ingredient_category_id,
          user_receipt_id: receiptId,
          ingredient_id: detail.ingredient_id,
          kilos: detail.kilos,
          price_per_kilos: detail.price_per_kilos,
          updated_at: new Date().toISOString(),
        }))
      );
  
    if (insertError) {
      console.error("Error inserting user_receipts_detail:", insertError.message);
      return false;
    }
  
    return true;
  };

  const updateReceiptAndDetails = async (receiptId, updatedReceipt, updatedDetails) => {
    const receiptUpdated = await updateReceipt(receiptId, updatedReceipt);
    if (!receiptUpdated) return false;
  
    const detailsUpdated = await updateReceiptDetails(receiptId, updatedDetails);
    if (!detailsUpdated) return false;
  
    return true;
  };


const handleSave = async () => {
  const receiptId = currentReceipt.id; // ID of the receipt being updated
  const updatedReceipt = {
    receipt_name: currentReceipt.receipt_name,
  };
  const updatedDetails = currentReceipt.ingredients.map((ingredient) => ({
    ingredient_category_id: Number(ingredient.ingredient_category_id), // Include ingredient_category_id
    ingredient_id: ingredient.ingredient_id,
    kilos: ingredient.kilos,
    price_per_kilos: ingredient.price_per_kilos,
  }));

  const success = await updateReceiptAndDetails(receiptId, updatedReceipt, updatedDetails);

  if (success) {
    console.log("Receipt and details updated successfully!");
    toast({
      title: 'Success',
      description: 'Receipt and details updated successfully',
    });
    await fetchReceipts(); 
    setIsDialogOpen(false);
  } else {
    toast({
      title: 'Error',
      description: 'Failed to update receipt',
      variant: 'destructive',
    });
    console.error("Failed to update receipt and details.");
  }
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

  const handleAddIngredient = (ingredient = null) => {
    console.log('ingredient', ingredient);
    if (ingredient) {
      // Pre-fill the form with the selected ingredient's values for editing
      setCurrentIngredient({
        ...ingredient,
        ingredient_category_id: ingredient.ingredient_category_id.toString(), // Ensure it's a string for the Select component
        ingredient_id: ingredient.ingredient_id.toString(),
        Name: ingredient.Name
      });
    } else {
      // Reset the form for adding a new ingredient
      setCurrentIngredient({
        ingredient_id: "",
        ingredient_category_id: "",
        Name: "",
        price_per_kilos: 0,
        kilos: 0,
        create_at: new Date(),
        update_at: new Date(),
      });
    }
    setIsIngredientDialogOpen(true);
  };

  const handleSaveIngredient = () => {
    if (
      !currentReceipt ||
      !currentIngredient ||
      !currentIngredient.ingredient_category_id ||
      !currentIngredient.ingredient_id
    ) {
      showError("Data Not Found");
      return;
    }
  
    const ingredientToSave = {
      ...currentIngredient,
      ingredient_category_id: Number(currentIngredient.ingredient_category_id),
      ingredient_id: Number(currentIngredient.ingredient_id),
      create_at: currentIngredient.create_at || new Date(),
      update_at: new Date(),
    };
  
    // Check if the ingredient already exists in the list
    const existingIngredientIndex = currentReceipt.ingredients.findIndex(
      (i) => i.ingredient_id === ingredientToSave.ingredient_id
    );
  
    if (existingIngredientIndex !== -1) {
      // Update the existing ingredient
      const updatedIngredients = [...currentReceipt.ingredients];
      updatedIngredients[existingIngredientIndex] = ingredientToSave;
      setCurrentReceipt({ ...currentReceipt, ingredients: updatedIngredients });
    } else {
      // Add a new ingredient
      setCurrentReceipt({
        ...currentReceipt,
        ingredients: [...currentReceipt.ingredients, ingredientToSave],
      });
    }
  
    setIsIngredientDialogOpen(false);
    setCurrentIngredient(null); // Reset after saving
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
              <TableHead>Created Time</TableHead>
              <TableHead>Updated Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">
                  {receipt.receipt_name}
                </TableCell>
                <TableCell className="font-medium">
                  {new Date(receipt.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  {new Date(receipt.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right align-top">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/receipt-nutritions/${receipt.id}`)}
                    className="ml-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
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

      <ReceiptForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        currentReceipt={currentReceipt}
        setCurrentReceipt={setCurrentReceipt}
        receipts={receipts}
        handleSave={handleSave}
        handleRemoveIngredient={handleRemoveIngredient}
        handleAddIngredient={handleAddIngredient}
        currentIngredient={currentIngredient}
        setCurrentIngredient={setCurrentIngredient}
        isIngredientDialogOpen={isIngredientDialogOpen}
        setIsIngredientDialogOpen={setIsIngredientDialogOpen}
        categories={categories}
        ingredients={ingredients}
        handleSaveIngredient={handleSaveIngredient}
      />

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
