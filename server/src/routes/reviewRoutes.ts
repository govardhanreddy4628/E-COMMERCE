import express from "express";
import { getPendingReviews, moderateReview, getReviewModerationStats } from "../controllers/reviewController.js";
//import { adminAuth } from "../middleware/adminAuth.js"; // restrict to admins

const router = express.Router();

// router.get("/reviews/pending", adminAuth, getPendingReviews);
// router.put("/reviews/:id/moderate", adminAuth, moderateReview);
// router.get("/reviews/stats", adminAuth, getReviewModerationStats);

router.get("/reviews/pending", getPendingReviews);
router.put("/reviews/:id/moderate", moderateReview);
router.get("/reviews/stats", getReviewModerationStats);

export default router;
