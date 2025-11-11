// --- src/admin/reviews/AdminReviewPage.tsx ---
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ReviewTable } from "./ReviewTable";

export interface Review {
  _id: string;
  product: { name: string };
  user: { name: string; email: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reviews/pending`);
      setReviews(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading pending reviews...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Pending Product Reviews</h1>
      <ReviewTable reviews={reviews} refresh={fetchPendingReviews} />
    </div>
  );
}
