// src/models/reviewsModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  media?: string[];
  verifiedPurchase: boolean;
  upvotes: number;
  downvotes: number;
  votedUsers: { userId: mongoose.Types.ObjectId; vote: "up" | "down" }[];
  status: "pending" | "approved" | "rejected";
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    comment: { type: String, required: true },
    media: [String],
    verifiedPurchase: { type: Boolean, default: false },
    votedUsers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        vote: { type: String, enum: ["up", "down"] },
      },
    ],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },

    // 🔹 Moderation fields
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    moderatedAt: { type: Date },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);
