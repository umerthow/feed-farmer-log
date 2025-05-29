import React, { useState, useEffect } from "react";
import { Ingredient } from "@/types/ingredient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type IngredientFormProps = {
  open: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  initialData?: Ingredient | null;
};

const emptyIngredient: Ingredient = {
  ID: "",
  Name: "",
  EM: 0,
  PK: 0,
  LK: 0,
  SK: 0,
  Abu: 0,
  Ca: 0,
  Ptot: 0,
  Chloride: 0,
  Linoleat: 0,
  Lysin: 0,
  Methionin: 0,
  Pavail: 0,
  Sodium: 0,
  Price: 0,
};

const IngredientForm = ({
  open,
  onClose,
  onSave,
  initialData,
}: IngredientFormProps) => {
  const [form, setForm] = useState<Ingredient>(emptyIngredient);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(emptyIngredient);
  }, [initialData, open]);

  const handleChange = (field: keyof Ingredient, value: string) => {
    setForm({
      ...form,
      [field]: field === "Name" ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form.ID ? "Edit Ingredient" : "Add Ingredient"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.Name}
              onChange={(e) => handleChange("Name", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>EM</Label>
              <Input
                type="number"
                inputMode="decimal"
                step="any"
                value={form.EM}
                onChange={(e) => handleChange("EM", e.target.value)}
              />
            </div>
            <div>
              <Label>PK</Label>
              <Input
                type="number"
                step="any"
                value={form.PK}
                onChange={(e) => handleChange("PK", e.target.value)}
              />
            </div>
            <div>
              <Label>LK</Label>
              <Input
                type="number"
                step="any"
                value={form.LK}
                onChange={(e) => handleChange("LK", e.target.value)}
              />
            </div>
            <div>
              <Label>SK</Label>
              <Input
                type="number"
                step="any"
                value={form.SK}
                onChange={(e) => handleChange("SK", e.target.value)}
              />
            </div>
            <div>
              <Label>Abu</Label>
              <Input
                type="number"
                step="any"
                value={form.Abu}
                onChange={(e) => handleChange("Abu", e.target.value)}
              />
            </div>
            <div>
              <Label>Ca</Label>
              <Input
                type="number"
                step="any"
                value={form.Ca}
                onChange={(e) => handleChange("Ca", e.target.value)}
              />
            </div>
            <div>
              <Label>Ptot</Label>
              <Input
                type="number"
                step="any"
                value={form.Ptot}
                onChange={(e) => handleChange("Ptot", e.target.value)}
              />
            </div>
            <div>
              <Label>Cloride</Label>
              <Input
                type="number"
                step="any"
                value={form.Chloride}
                onChange={(e) => handleChange("Chloride", e.target.value)}
              />
            </div>
            <div>
              <Label>Linoleat</Label>
              <Input
                type="number"
                step="any"
                value={form.Linoleat}
                onChange={(e) => handleChange("Linoleat", e.target.value)}
              />
            </div>
            <div>
              <Label>Lysin</Label>
              <Input
                type="number"
                step="any"
                value={form.Lysin}
                onChange={(e) => handleChange("Lysin", e.target.value)}
              />
            </div>
            <div>
              <Label>Methionin</Label>
              <Input
                type="number"
                step="any"
                value={form.Methionin}
                onChange={(e) => handleChange("Methionin", e.target.value)}
              />
            </div>
            <div>
              <Label>Pavail</Label>
              <Input
                type="number"
                step="any"
                value={form.Pavail}
                onChange={(e) => handleChange("Pavail", e.target.value)}
              />
            </div>
            <div>
              <Label>Sodium</Label>
              <Input
                type="number"
                step="any"
                value={form.Sodium}
                onChange={(e) => handleChange("Sodium", e.target.value)}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="any"
                value={form.Price}
                onChange={(e) => handleChange("Price", e.target.value)}
                placeholder="Masukkan harga (contoh: 10000)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientForm;
