import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  type: "Bank Offer" | "Special Price" | "Coupon" | "Cashback";
  description: string;
  discountValue?: number;
  discountType?: "PERCENTAGE" | "FLAT";
  maxDiscount?: number;
  minOrderValue?: number;
  applicableBanks?: string[];
  paymentMethods?: string[];
  applicableCategories?: string[];
  applicableProducts?: string[];
  couponCode?: string;
  validFrom?: Date;
  validTill?: Date;
  usageLimit?: number;
  isStackable?: boolean;
  priority?: number;
}

const OfferSchema: Schema = new Schema(
  {
    type: { type: String, required: true, enum: ["Bank Offer", "Special Price", "Coupon", "Cashback"] },
    description: { type: String, required: true },
    discountValue: { type: Number },
    discountType: { type: String, enum: ["PERCENTAGE", "FLAT"] },
    maxDiscount: { type: Number },
    minOrderValue: { type: Number },
    applicableBanks: [{ type: String }],
    paymentMethods: [{ type: String }],
    applicableCategories: [{ type: String }],
    applicableProducts: [{ type: String }],
    couponCode: { type: String },
    validFrom: { type: Date },
    validTill: { type: Date },
    usageLimit: { type: Number },
    isStackable: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OfferModel = mongoose.model<IOffer>("Offer", OfferSchema);
