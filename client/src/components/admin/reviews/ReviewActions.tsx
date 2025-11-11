// --- src/admin/reviews/ReviewActions.tsx ---
import axios from "axios";
import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface Props {
  reviewId: string;
  refresh: () => void;
}

export function ReviewActions({ reviewId, refresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleModeration = async (action: "approved" | "rejected") => {
    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reviews/${reviewId}/moderate`, {
        adminId: localStorage.getItem("admin_id"),
        action,
      });
      refresh();
    } catch (err: any) {
      console.error(err);
      alert("Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleModeration("approved")}
        className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
        disabled={loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
      <button
        onClick={() => handleModeration("rejected")}
        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
        disabled={loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
      </button>
    </div>
  );
}
