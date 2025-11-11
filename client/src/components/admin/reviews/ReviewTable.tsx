// --- src/admin/reviews/ReviewTable.tsx ---
import { Review } from "./ReviewPage";
import { ReviewActions } from "./ReviewActions";

interface Props {
  reviews: Review[];
  refresh: () => void;
}

export function ReviewTable({ reviews, refresh }: Props) {
  if (reviews.length === 0) {
    return <div className="m-auto bg-white border rounded-lg flex items-center justify-center py-10"><p className="text-gray-500 text-26px">No pending reviews found 🎉</p></div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Product</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Rating</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Comment</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {reviews.map((r) => (
            <tr key={r._id}>
              <td className="px-4 py-2">{r.product?.name || "N/A"}</td>
              <td className="px-4 py-2">{r.user?.name} <br /> <span className="text-xs text-gray-400">{r.user?.email}</span></td>
              <td className="px-4 py-2">{r.rating}⭐</td>
              <td className="px-4 py-2 max-w-xs truncate">{r.comment}</td>
              <td className="px-4 py-2">
                <ReviewActions reviewId={r._id} refresh={refresh} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
