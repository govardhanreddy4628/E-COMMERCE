import mongoose, { Schema, Document, Types } from "mongoose";

export type OfferType = "Bank Offer" | "Special Price" | "Coupon" | "Cashback";
export type DiscountType = "FLAT" | "PERCENTAGE";

export interface IOffer extends Document {
  type: OfferType;
  description: string;
  discountValue?: number;
  discountType?: DiscountType;
  maxDiscount?: number;
  applicableBanks?: string[];
  minOrderValue?: number;
  paymentMethods?: string[];
  applicableCategories?: string[];
  applicableProducts?: Types.ObjectId[];
  couponCode?: string;
  validFrom?: Date;
  validTill?: Date;
  usageLimit?: number;
  isStackable?: boolean;
  priority?: number;
  createdBy?: Types.ObjectId;
  usageCount?: number;
  isActive?: boolean;
  terms?: string;
}

const OfferSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Bank Offer", "Special Price", "Coupon", "Cashback"],
    },
    description: { type: String, required: true },
    discountValue: { type: Number, default: 0, required: true },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      default: "FLAT",
    },
    maxDiscount: { type: Number, default: 0 },
    minOrderValue: { type: Number, default: 0 },
    applicableBanks: [String],
    paymentMethods: [String],
    applicableCategories: [String],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    couponCode: String,
    validFrom: Date,
    validTill: Date,
    usageLimit: { type: Number },
    isStackable: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    terms: String,
  },
  { timestamps: true }
);

// Indexes for common queries
OfferSchema.index({ type: 1 });
OfferSchema.index({ couponCode: 1 }, { sparse: true });
OfferSchema.index({ isActive: 1, validFrom: 1, validTill: 1 });

export const OfferModel = mongoose.model<IOffer>("Offer", OfferSchema);
