import { useEffect, useState } from "react";
import supabase from "@/api/supabase";
import { UserReceipt } from "@/types/receipt";

export function useReceipts(currentUser, ingredients, showError) {
  const [receipts, setReceipts] = useState<UserReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_receipts")
      .select(`
        *,
        user_receipts_detail (
          *,
          ingredient (
            *
          ),
          ingredient_category (*)
        )
      `)
      .eq("user_id", currentUser.uid)
      .order("created_at", { ascending: false });
    if (error) {
      showError?.("Error fetching receipts: " + error.message);
    } else {
      setReceipts(
        (data || []).map((r) => ({
          ...r,
          ingredients: (r.user_receipts_detail || []).map((d) => ({
            ...d,
            Name:
              ingredients.find((i) => i.ID === d.ingredient_id)?.Name ||
              "Unknown",
          })),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, ingredients]);

  return { receipts, setReceipts, loading, fetchReceipts };
}