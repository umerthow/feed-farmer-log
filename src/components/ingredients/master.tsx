import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Ingredient = {
  id: string;
  name: string;
  EM: number;
  PK: number;
  LK: number;
  SK: number;
  Abu: number;
  Ca: number;
  Ptot: number;
  Pavail: number;
  Sodium: number;
  Chloride: number;
  Methionin: number;
  Lysin: number;
  Linoleat: number;
  price: number;
};

const initialIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Corn',
    EM: 3.3,
    PK: 8.5,
    LK: 3.8,
    SK: 2.2,
    Abu: 1.3,
    Ca: 0.2,
    Ptot: 0.3,
    Pavail: 0.1,
    Sodium: 0.02,
    Chloride: 0.05,
    Methionin: 0.18,
    Lysin: 0.25,
    Linoleat: 2.2,
    price: 0.45
  },
  {
    id: '2',
    name: 'Soybean Meal',
    EM: 2.4,
    PK: 46.5,
    LK: 1.5,
    SK: 6.2,
    Abu: 6.3,
    Ca: 0.3,
    Ptot: 0.65,
    Pavail: 0.2,
    Sodium: 0.01,
    Chloride: 0.03,
    Methionin: 0.65,
    Lysin: 2.85,
    Linoleat: 0.55,
    price: 0.65
  }
];

const IngredientMaster = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(null);

  const handleAddNew = () => {
    setCurrentIngredient({
      id: Date.now().toString(),
      name: '',
      EM: 0,
      PK: 0,
      LK: 0,
      SK: 0,
      Abu: 0,
      Ca: 0,
      Ptot: 0,
      Pavail: 0,
      Sodium: 0,
      Chloride: 0,
      Methionin: 0,
      Lysin: 0,
      Linoleat: 0,
      price: 0
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setCurrentIngredient({...ingredient});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleSave = () => {
    if (!currentIngredient) return;
    
    if (ingredients.some(ing => ing.id === currentIngredient.id)) {
      setIngredients(ingredients.map(ing => 
        ing.id === currentIngredient.id ? currentIngredient : ing
      ));
    } else {
      setIngredients([...ingredients, currentIngredient]);
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof Ingredient, value: string) => {
    if (!currentIngredient) return;
    
    if (field === 'name') {
      setCurrentIngredient({...currentIngredient, [field]: value});
    } else {
      setCurrentIngredient({...currentIngredient, [field]: parseFloat(value) || 0});
    }
  };

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
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>{ingredient.EM}</TableCell>
                <TableCell>{ingredient.PK}</TableCell>
                <TableCell>{ingredient.LK}</TableCell>
                <TableCell>{ingredient.SK}</TableCell>
                <TableCell>{ingredient.Abu}</TableCell>
                <TableCell>{ingredient.Ca}</TableCell>
                <TableCell>{ingredient.Ptot}</TableCell>
                <TableCell>${ingredient.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(ingredient)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ingredient.id)}>
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
              {currentIngredient && ingredients.some(ing => ing.id === currentIngredient.id) 
                ? 'Edit Ingredient' 
                : 'Add New Ingredient'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentIngredient?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="em">EM</Label>
              <Input
                id="em"
                type="number"
                value={currentIngredient?.EM || 0}
                onChange={(e) => handleInputChange('EM', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pk">PK</Label>
              <Input
                id="pk"
                type="number"
                value={currentIngredient?.PK || 0}
                onChange={(e) => handleInputChange('PK', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lk">LK</Label>
              <Input
                id="lk"
                type="number"
                value={currentIngredient?.LK || 0}
                onChange={(e) => handleInputChange('LK', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sk">SK</Label>
              <Input
                id="sk"
                type="number"
                value={currentIngredient?.SK || 0}
                onChange={(e) => handleInputChange('SK', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={currentIngredient?.price || 0}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientMaster;
