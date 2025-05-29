import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Receipt = {
  id: string;
  name: string;
  pricePerKg: number;
  fedKg: number;
  fedPercent: number;
  price: number;
  ingredients: ReceiptIngredient[];
};

type ReceiptIngredient = {
  id: string;
  name: string;
  quantity: number;
};

const initialReceipts: Receipt[] = [
  {
    id: '1',
    name: 'Dairy Cow Mix',
    pricePerKg: 3.2,
    fedKg: 12,
    fedPercent: 100,
    price: 38.4,
    ingredients: [
      { id: '1', name: 'Corn', quantity: 6 },
      { id: '2', name: 'Soybean Meal', quantity: 4 },
    ]
  },
  {
    id: '2',
    name: 'Goat Feed',
    pricePerKg: 2.8,
    fedKg: 5,
    fedPercent: 100,
    price: 14,
    ingredients: [
      { id: '1', name: 'Corn', quantity: 3 },
      { id: '2', name: 'Soybean Meal', quantity: 1.5 },
    ]
  }
];

const availableIngredients = [
  { id: '1', name: 'Corn' },
  { id: '2', name: 'Soybean Meal' },
  { id: '3', name: 'Wheat Bran' },
  { id: '4', name: 'Alfalfa' },
];

const Receipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [currentIngredient, setCurrentIngredient] = useState<ReceiptIngredient | null>(null);
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);

  const handleAddNew = () => {
    setCurrentReceipt({
      id: Date.now().toString(),
      name: '',
      pricePerKg: 0,
      fedKg: 0,
      fedPercent: 100,
      price: 0,
      ingredients: []
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (receipt: Receipt) => {
    setCurrentReceipt({...receipt});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReceipts(receipts.filter(r => r.id !== id));
  };

  const handleSave = () => {
    if (!currentReceipt) return;
    
    // Calculate price based on fed kg and price per kg
    const updatedReceipt = {
      ...currentReceipt,
      price: currentReceipt.pricePerKg * currentReceipt.fedKg
    };
    
    if (receipts.some(r => r.id === updatedReceipt.id)) {
      setReceipts(receipts.map(r => 
        r.id === updatedReceipt.id ? updatedReceipt : r
      ));
    } else {
      setReceipts([...receipts, updatedReceipt]);
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof Receipt, value: string) => {
    if (!currentReceipt) return;
    
    if (field === 'name') {
      setCurrentReceipt({...currentReceipt, [field]: value});
    } else {
      setCurrentReceipt({...currentReceipt, [field]: parseFloat(value) || 0});
    }
  };

  const handleAddIngredient = () => {
    if (!currentReceipt) return;
    
    setCurrentIngredient({
      id: '',
      name: '',
      quantity: 0
    });
    
    setIsIngredientDialogOpen(true);
  };

  const handleSaveIngredient = () => {
    if (!currentReceipt || !currentIngredient || !currentIngredient.id) return;
    
    const selectedIngredient = availableIngredients.find(i => i.id === currentIngredient.id);
    if (!selectedIngredient) return;
    
    const updatedIngredient = {
      ...currentIngredient,
      name: selectedIngredient.name
    };
    
    setCurrentReceipt({
      ...currentReceipt,
      ingredients: [...currentReceipt.ingredients, updatedIngredient]
    });
    
    setIsIngredientDialogOpen(false);
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    if (!currentReceipt) return;
    
    setCurrentReceipt({
      ...currentReceipt,
      ingredients: currentReceipt.ingredients.filter(i => i.id !== ingredientId)
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Add Receipt
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price per kg</TableHead>
              <TableHead>Fed (kg)</TableHead>
              <TableHead>Fed (%)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">{receipt.name}</TableCell>
                <TableCell>${receipt.pricePerKg.toFixed(2)}</TableCell>
                <TableCell>{receipt.fedKg} kg</TableCell>
                <TableCell>{receipt.fedPercent}%</TableCell>
                <TableCell>${receipt.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(receipt)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(receipt.id)}>
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
              {currentReceipt && receipts.some(r => r.id === currentReceipt.id) 
                ? 'Edit Receipt' 
                : 'Add New Receipt'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentReceipt?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pricePerKg">Price per kg</Label>
              <Input
                id="pricePerKg"
                type="number"
                value={currentReceipt?.pricePerKg || 0}
                onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fedKg">Fed (kg)</Label>
              <Input
                id="fedKg"
                type="number"
                value={currentReceipt?.fedKg || 0}
                onChange={(e) => handleInputChange('fedKg', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fedPercent">Fed (%)</Label>
              <Input
                id="fedPercent"
                type="number"
                value={currentReceipt?.fedPercent || 0}
                onChange={(e) => handleInputChange('fedPercent', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Ingredients</Label>
                <Button variant="outline" size="sm" onClick={handleAddIngredient}>
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReceipt?.ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>{ingredient.name}</TableCell>
                      <TableCell>{ingredient.quantity} kg</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveIngredient(ingredient.id)}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ingredient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="ingredient">Ingredient</Label>
              <Select 
                onValueChange={(value) => setCurrentIngredient({...currentIngredient!, id: value, name: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {availableIngredients.map((ingredient) => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                value={currentIngredient?.quantity || 0}
                onChange={(e) => setCurrentIngredient({...currentIngredient!, quantity: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIngredientDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveIngredient} className="bg-green-600 hover:bg-green-700">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts;
