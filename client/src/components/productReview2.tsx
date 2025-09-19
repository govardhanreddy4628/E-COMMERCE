import React, { useState } from "react";
import { Grid, List } from "lucide-react";

interface Review {
  id: number;
  name: string;
  date: string;
  message: string;
  rating: number;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Tirth Bagadiya",
    date: "2025-08-06",
    message: "Hi, this product is good. Works as expected!",
    rating: 4,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocId4JhPIKVroKftXs3REtZNKGWnmC28CQFwZRn45upN_CxeYQ=s96-c",
  },
  {
    id: 2,
    name: "John Doe",
    date: "2025-08-05",
    message: "Decent quality for the price, but delivery was slow.",
    rating: 3,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
  {
    id: 3,
    name: "Jane Smith",
    date: "2025-08-02",
    message: "Amazing product! Highly recommended 💯",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a/default-user-avatar",
  },
];

// ⭐ Rating Stars
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex mt-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={i < rating ? "gold" : "none"}
        stroke="currentColor"
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.462a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118l-3.385-2.462a1 1 0 00-1.176 0l-3.385 2.462c-.784.57-1.838-.197-1.539-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.047 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"
        />
      </svg>
    ))}
  </div>
);

// 📌 Review in Card Format
const ReviewGridItem: React.FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
    <div className="flex items-center gap-3 mb-2">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-12 h-12 rounded-full object-cover border"
      />
      <div>
        <h4 className="font-semibold text-gray-800 text-sm">{review.name}</h4>
        <span className="text-xs text-gray-500">{review.date}</span>
      </div>
    </div>
    <StarRating rating={review.rating} />
    <p className="text-sm text-gray-700 mt-2">{review.message}</p>
  </div>
);

// 📌 Main ReviewList Component
const ReviewList: React.FC = () => {
  const [gridView, setGridView] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto  py-4 px-6 bg-white relative">
      {/* Toggle Button (fixed at top-right inside container) */}
      <div className="sticky top-1 right-2 flex justify-end mb-4">
        <button
          onClick={() => setGridView(!gridView)}
          className={`p-2 rounded-md shadow transition ${
            gridView ? "bg-red-400 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          { <Grid size={18} />}
        </button>
      </div>
      <div className="h-[550px] overflow-y-auto">

      {/* Reviews */}
      <div
        className={
          gridView
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-1 gap-4"
        }
      >
        {reviews.map((review, index) => (
          <ReviewGridItem key={index} review={review} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default ReviewList;
