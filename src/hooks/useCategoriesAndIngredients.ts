import { useEffect, useState } from "react";
import supabase from "@/api/supabase";

export function useCategoriesAndIngredients() {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: cat } = await supabase.from("ingredient_category").select("*");
      const { data: ing } = await supabase.from("ingredient").select("*");
      setCategories(cat || []);
      setIngredients(ing || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return { categories, ingredients, loading };
}