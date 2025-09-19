import { Request, Response, NextFunction } from "express";
import { OfferModel } from "../models/offer.model";
import { OfferSchema } from "../validations/offer.validation";

// ✅ Create Offer
export const createOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = OfferSchema.parse(req.body); // validate with Zod
    const offer = new OfferModel(parsed);
    const savedOffer = await offer.save();

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: savedOffer,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: error.errors });
    }
    next(error);
  }
};

// ✅ Get All Offers
export const getOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offers = await OfferModel.find();
    res.json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Offer by ID
export const getOfferById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offer = await OfferModel.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Offer
export const updateOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = OfferSchema.partial().parse(req.body); // allow partial updates
    const updatedOffer = await OfferModel.findByIdAndUpdate(req.params.id, parsed, { new: true });

    if (!updatedOffer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    res.json({ success: true, message: "Offer updated", data: updatedOffer });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: error.errors });
    }
    next(error);
  }
};

// ✅ Delete Offer
export const deleteOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedOffer = await OfferModel.findByIdAndDelete(req.params.id);
    if (!deletedOffer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    res.json({ success: true, message: "Offer deleted" });
  } catch (error) {
    next(error);
  }
};
