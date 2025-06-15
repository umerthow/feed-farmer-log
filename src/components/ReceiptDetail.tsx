import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "@/api/supabase";
import ReceiptsNutritionTable from "@/components/receipts/ReceiptsNutritionTable";
import { useAuth } from "@/contexts/AuthContext";

const ReceiptDetail = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchReceipt = async () => {
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
        .eq("id", id)
        .eq("user_id", currentUser.uid)
        .single();
      if (!error) setReceipt(data);
      setLoading(false);
    };
    fetchReceipt();
  }, [id, currentUser]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded hover:bg-gray-100 transition"
          aria-label="Back"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">
          {receipt ? receipt.receipt_name : "Detail Receipt"}
        </h1>
      </div>
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Loading...</div>
        ) : receipt ? (
          <ReceiptsNutritionTable receipts={[receipt]} />
        ) : (
          <div className="text-center text-gray-500 py-8">Data Tidak Ditemukan.</div>
        )}
      </div>
    </div>
  );
};

export default ReceiptDetail;