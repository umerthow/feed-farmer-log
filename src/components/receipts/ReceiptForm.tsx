import React, { useState } from "react";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { UserReceipt } from "@/types/receipt";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ReceiptForm = ({
  isDialogOpen,
  setIsDialogOpen,
  currentReceipt,
  setCurrentReceipt,
  receipts,
  handleSave,
  handleRemoveIngredient,
  handleAddIngredient,
  currentIngredient,
  setCurrentIngredient,
  isIngredientDialogOpen,
  setIsIngredientDialogOpen,
  categories,
  ingredients,
  handleSaveIngredient,
}) => {
  const handleInputChange = (field: keyof UserReceipt, value: string) => {
    if (!currentReceipt) return;
    setCurrentReceipt({ ...currentReceipt, [field]: value });
  };

  return (
    <>
      {/* Receipt Form Dialog */}
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
                  onClick={() => handleAddIngredient()} // Pass the ingredient to edit
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Price per kg</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReceipt?.ingredients.map((ingredient) => (
                    <TableRow key={ingredient.ingredient_id}>
                      <TableCell>{ingredient.Name}</TableCell>
                      <TableCell>
                        {ingredient.ingredient_category.name}
                      </TableCell>
                      <TableCell>{ingredient.kilos}</TableCell>
                      <TableCell>{ingredient.price_per_kilos}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddIngredient(ingredient)} // Pass the ingredient to edit
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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

      {/* Ingredient Form Dialog */}
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
                    ingredient_id: "", // Reset ingredient when category changes
                  })
                }
                value={currentIngredient?.ingredient_category_id || ""} // Auto-select based on current value
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
                    Name: ingredients.find((i) => i.ID === Number(value))?.Name ||
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
    </>
  );
};

export default ReceiptForm;
