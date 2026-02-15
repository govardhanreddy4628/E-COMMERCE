import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";
import { z } from "zod";
import { moderateComment } from "../utils/moderation.js";
import { ReviewModel } from "../models/reviewsModel.js";

// --- Zod validation schema for adding/updating review ---
const ReviewValidationSchema = z.object({
  product: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
  user: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(5),
  media: z.array(z.string().url()).optional(),
});

// --- Update Product rating aggregation ---
const updateProductRating = async (productId: string) => {
  const agg = await ReviewModel.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  await ProductModel.findByIdAndUpdate(productId, {
    rating: agg[0]?.averageRating || 0,
    recentQuantity: agg[0]?.totalReviews || 0,
  });
};

// --- Add a review ---
export const addReview = async (req: Request, res: Response) => {
  try {
    const validated = ReviewValidationSchema.parse(req.body);

    // 1️⃣ Prevent duplicate reviews by same user
    const existing = await ReviewModel.findOne({
      product: validated.product,
      user: validated.user,
    });
    if (existing)
      return res
        .status(400)
        .json({ error: "User has already reviewed this product" });

    // 2️⃣ Count previous reviews for spam heuristic
    const userPreviousCount = await ReviewModel.countDocuments({
      user: validated.user,
      createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    });

    // 3️⃣ Moderate comment
    const { ok, reason } = moderateComment(validated.comment, {
      userPreviousCount,
    });

    // 4️⃣ Decide status based on moderation
    let status: "pending" | "approved" | "rejected" = "approved"; // default

    if (!ok) {
      // If rejected for strong profanity → reject
      if (reason === "contains_profanity") {
        status = "rejected";
      } else {
        // For mild spam or suspicious — send to admin
        status = "pending";
      }
    } else {
      // Optionally: randomly send 5–10% of clean reviews for audit
      if (Math.random() < 0.05) {
        status = "pending"; // 5% random sample for admin check
      }
    }

    // 5️⃣ Optional purchase verification
    const verifiedPurchase = true; // Replace with actual order check

    // 6️⃣ Save review
    const review = await ReviewModel.create({
      ...validated,
      verifiedPurchase,
      status,
    });

    // 7️⃣ Update rating immediately only if approved
    if (status === "approved") {
      await updateProductRating(validated.product);
    }

    // 8️⃣ Response message
    if (status === "approved") {
      return res.status(201).json({
        message: "Your review has been posted successfully!",
        review,
      });
    } else if (status === "pending") {
      return res.status(201).json({
        message: "Your review is under moderation and will be visible soon.",
        review,
      });
    } else {
      return res.status(400).json({
        message: "Your review contains inappropriate content and was rejected.",
      });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// --- Get reviews for a product with pagination & sorting ---
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = "recent" } = req.query;

    const sortOptions: any = { createdAt: -1 };
    if (sortBy === "helpful") sortOptions.upvotes = -1;
    else if (sortBy === "rating_high") sortOptions.rating = -1;
    else if (sortBy === "rating_low") sortOptions.rating = 1;

    const reviews = await ReviewModel.find({
      product: productId,
      status: "approved",
    })
      .populate("user", "name")
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort(sortOptions);

    const stats = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({
      reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// --- Vote on review (upvote/downvote) ---
export const voteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { userId, vote } = req.body; // vote: "up" or "down"

    if (!["up", "down"].includes(vote))
      return res.status(400).json({ error: "Invalid vote type" });

    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const existingVote = review.votedUsers?.find(
      (v) => v.userId.toString() === userId,
    );
    if (existingVote) {
      if (existingVote.vote === vote) return res.json(review); // already voted same way
      existingVote.vote = vote; // update opposite vote
    } else {
      review.votedUsers?.push({
        userId: new mongoose.Types.ObjectId(userId),
        vote,
      });
    }

    review.upvotes = review.votedUsers?.filter((v) => v.vote === "up").length;
    review.downvotes = review.votedUsers?.filter(
      (v) => v.vote === "down",
    ).length;

    await review.save();
    res.json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// --- Update a review ---
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const validated = ReviewValidationSchema.partial().parse(req.body);

    const review = await ReviewModel.findByIdAndUpdate(reviewId, validated, {
      new: true,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });

    await updateProductRating(review.product.toString());
    res.json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// --- Delete a review ---
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    await updateProductRating(review.product.toString());
    res.json({ message: "Review deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/admin/reviews/pending
export const getPendingReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await ReviewModel.find({ status: "pending" })
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err: unknown) {
    let message = "Something went wrong";
    if (err instanceof Error) message = err.message;

    res.status(500).json({ success: false, error: message });
  }
};

// PUT /api/admin/reviews/:id/moderate
export const moderateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"
    const adminId = req.user?.id; // assuming JWT auth middleware

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const review = await ReviewModel.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    review.status = action === "approve" ? "approved" : "rejected";
    review.moderatedBy = adminId;
    review.moderatedAt = new Date();

    await review.save();

    // ✅ If approved, update product rating
    if (action === "approve") {
      const { product } = review;
      const agg = await ReviewModel.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(product),
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      await mongoose.model("Product").findByIdAndUpdate(product, {
        rating: agg[0]?.averageRating || 0,
        recentQuantity: agg[0]?.totalReviews || 0,
      });
    }

    res.json({
      success: true,
      message: `Review ${action}d successfully`,
      review,
    });
  } catch (err: unknown) {
    let message = "Something went wrong";
    if (err instanceof Error) message = err.message;

    res.status(500).json({ success: false, error: message });
  }
};

// GET /api/admin/reviews/stats
export const getReviewModerationStats = async (req: Request, res: Response) => {
  try {
    const [counts] = await ReviewModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      stats: counts || { total: 0, pending: 0, approved: 0, rejected: 0 },
    });
  } catch (err: unknown) {
    let message = "Something went wrong";
    if (err instanceof Error) message = err.message;

    res.status(500).json({ success: false, error: message });
  }
};
