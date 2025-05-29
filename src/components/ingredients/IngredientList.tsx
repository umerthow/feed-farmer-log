import React, { useEffect, useState } from 'react';
import supabase from '@/api/supabase';
import { Ingredient } from '@/types/ingredient';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import IngredientForm from './IngredientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import ErrorDialog from '../ui/ErrorDialog';
import LoadingSpinner from '../ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Ingredient | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  // Helper to show error
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorDialogOpen(true);
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase.from('ingredient').select('*');
      if (error) {
        showError('Error fetching ingredients: ' + error.message);
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

  const confirmDelete = (ingredient: Ingredient) => {
    setToDelete(ingredient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from('ingredient').delete().eq('ID', toDelete.ID);
    if (error) {
      showError('Error deleting ingredient: ' + error.message);
    } else {
      setIngredients(ingredients.filter(ingredient => ingredient.ID !== toDelete.ID));
    }
    setDeleteDialogOpen(false);
    setToDelete(null);
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
        showError('Error updating ingredient: ' + error.message);
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
        showError('Error adding ingredient: ' + error.message);
        return;
      }
      setIngredients([...ingredients, data]);
    }
    toast({
      title: 'Success',
      description: `Success crate new ${data.Name} ingredients`,
      variant: 'default'
    });

    setFormOpen(false);


  };

  if (loading) return <LoadingSpinner message="Loading ingredients..." />;

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
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(ingredient)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ingredient</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <b>{toDelete?.Name}</b>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <IngredientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />
      <ErrorDialog
        open={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
    </div>
  );
};

export default IngredientList;