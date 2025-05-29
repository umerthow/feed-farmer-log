import { useCategoriesAndIngredients } from "@/hooks/useCategoriesAndIngredients";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ReceiptForm({ open, onClose, onSave, initialData, userId }) {
  const { categories, ingredients } = useCategoriesAndIngredients();
  const [form, setForm] = useState(initialData || { name: "", ingredients: [] });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [ingredientDetail, setIngredientDetail] = useState<any>(null);

  // ...handle input changes...

  // Add ingredient flow
  const handleAddIngredient = () => {
    setIngredientDetail({
      ingredient_id: "",
      ingredient_category_id: selectedCategory,
      price_per_kilos: 0,
      kilos: 0,
    });
  };

  // Save ingredient to form
  const handleSaveIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ingredientDetail],
    });
    setIngredientDetail(null);
    setSelectedCategory(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add/Edit Receipt</DialogTitle>
        </DialogHeader>
        <div>
          <Label>Receipt Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Ingredients</Label>
          <Button onClick={handleAddIngredient}>Add Ingredient</Button>
          {/* List ingredients here */}
        </div>
        {ingredientDetail && (
          <div>
            <Label>Category</Label>
            <Select onValueChange={val => setSelectedCategory(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Ingredient</Label>
            <Select onValueChange={val => setIngredientDetail({ ...ingredientDetail, ingredient_id: Number(val) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ingredient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients
                  .filter(ing => ing.ingredient_category_id === selectedCategory)
                  .map(ing => (
                    <SelectItem key={ing.ID} value={ing.ID}>{ing.Name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label>Price per kg</Label>
            <Input type="number" onChange={e => setIngredientDetail({ ...ingredientDetail, price_per_kilos: parseFloat(e.target.value) })} />
            <Label>Kilos</Label>
            <Input type="number" onChange={e => setIngredientDetail({ ...ingredientDetail, kilos: parseFloat(e.target.value) })} />
            <Button onClick={handleSaveIngredient}>Save Ingredient</Button>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onSave(form)}>Save Receipt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}