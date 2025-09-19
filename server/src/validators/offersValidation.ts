import { z } from "zod";

export const OfferSchema = z.object({
  type: z.enum(["Bank Offer", "Special Price", "Coupon", "Cashback"]),
  description: z.string().min(1, "Offer description is required"),
  discountValue: z.number().min(0).optional(),
  discountType: z.enum(["PERCENTAGE", "FLAT"]).optional(),
  maxDiscount: z.number().min(0).optional(),
  minOrderValue: z.number().min(0).optional(),
  applicableBanks: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  applicableProducts: z.array(z.string()).optional(),
  couponCode: z.string().optional(),
  validFrom: z.string().datetime().optional(),
  validTill: z.string().datetime().optional(),
  usageLimit: z.number().min(1).optional(),
  isStackable: z.boolean().optional(),
  priority: z.number().optional()
});
