import React, { useEffect, useState } from 'react';
import supabase from '@/api/supabase';
import { Ingredient } from '@/types/ingredient';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import IngredientForm from './IngredientForm';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase.from('ingredient').select('*');
      if (error) {
        console.error('Error fetching ingredients:', error);
      } else {
        setIngredients(data);
      }
      setLoading(false);
    };
    fetchIngredients();
  }, []);

  const handleAddNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('ingredient').delete().eq('ID', id);
    if (error) {
      console.error('Error deleting ingredient:', error);
    } else {
      setIngredients(ingredients.filter(ingredient => ingredient.ID !== id));
    }
  };

  const handleSave = async (ingredient: Ingredient) => {
    const { ID, ...data } = ingredient
    if (ingredient.ID) {
      // Update
      const { error } = await supabase
        .from('ingredient')
        .update({...data})
        .eq('ID', ingredient.ID);
      if (error) {
        console.error('Error updating ingredient:', error);
        return;
      }
      setIngredients(ingredients.map(i => (i.ID === ingredient.ID ? ingredient : i)));
    } else {
      delete ingredient.ID
      // Insert
      const { data, error } = await supabase
        .from('ingredient')
        .insert([{ ...ingredient}])
        .select()
        .single();
      if (error) {
        console.error('Error adding ingredient:', error);
        return;
      }
      setIngredients([...ingredients, data]);
    }
    setFormOpen(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <svg className="animate-spin h-8 w-8 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-green-700 font-semibold text-lg">Loading ingredients...</span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ingredient Master</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Add Ingredient
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>EM</TableHead>
              <TableHead>PK</TableHead>
              <TableHead>LK</TableHead>
              <TableHead>SK</TableHead>
              <TableHead>Abu</TableHead>
              <TableHead>Ca</TableHead>
              <TableHead>Ptot</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.ID}>
                <TableCell className="font-medium">{ingredient.Name}</TableCell>
                <TableCell>{ingredient.EM}</TableCell>
                <TableCell>{ingredient.PK}</TableCell>
                <TableCell>{ingredient.LK}</TableCell>
                <TableCell>{ingredient.SK}</TableCell>
                <TableCell>{ingredient.Abu}</TableCell>
                <TableCell>{ingredient.Ca}</TableCell>
                <TableCell>{ingredient.Ptot}</TableCell>
                <TableCell>{ingredient.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(ingredient)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ingredient.ID)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <IngredientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />
    </div>
  );
};

export default IngredientList;