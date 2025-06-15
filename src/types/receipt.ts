import { Ingredient } from "./ingredient";

interface ReceiptIngredient extends Partial<Ingredient> {
  ingredient_id: number;
  price_per_kilos: number;
  kilos: number;
  create_at: Date;
  update_at: Date;
  ingredient_category_id: number;
};

interface Receipt {
  id: string;
  receipt_name: string;
  ingredients: ReceiptIngredient[];
};

export interface UserReceipt extends Receipt{
  user_id: string;
  updated_at: Date;
  created_at: Date;
}
