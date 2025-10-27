import mongoose, { Schema, Document, Types } from "mongoose";


export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;            // 1-5
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
  media?: string[];          // URLs of images/videos
  upvotes?: number;
  downvotes?: number;
  votedUsers?: {            // track who voted to prevent multiple votes
    userId: Types.ObjectId;
    vote: "up" | "down";
  }[];
  status?: "pending" | "approved" | "rejected"; // moderation
  createdAt?: Date;
  updatedAt?: Date;
}


const VotedUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  vote: { type: String, enum: ["up", "down"] },
}, { _id: false });

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: false },
    media: { type: [String], default: [] },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    votedUsers: [VotedUserSchema],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
