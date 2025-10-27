import express from "express";
import {createOffer, getOffers, getOfferById, updateOffer, deleteOffer} from "../controllers/offersController";
import { validate } from "../middleware/validate";
import { OfferSchema } from "../validators/offersValidation";

const router = express.Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
	Promise.resolve(fn(req, res, next)).catch(next);
  };
}


router.post("/", validate(OfferSchema), asyncHandler(createOffer));
router.get("/", getOffers);
// router.get("/:id", getOfferById);
// router.put("/:id", updateOffer);
// router.delete("/:id", deleteOffer);

export default router;
