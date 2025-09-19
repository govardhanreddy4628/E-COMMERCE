import express from "express";
import {createOffer, getOffers, getOfferById, updateOffer, deleteOffer} from "../controllers/offersController";

const router = express.Router();

// router.post("/", createOffer);
router.get("/", getOffers);
// router.get("/:id", getOfferById);
// router.put("/:id", updateOffer);
// router.delete("/:id", deleteOffer);

export default router;
