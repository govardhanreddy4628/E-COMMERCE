import { z } from "zod";

// Reuse enums for consistency
const shippingMethodTypes = ["standard", "express", "same-day", "pickup"] as const;
const statusTypes = ["active", "inactive", "deleted"] as const;

// Shipping Schema (Zod)
const ShippingSchema = z.object({
  isShippable: z.boolean().default(true),

  shippingCost: z.number().min(0).optional(),

  shippingMethods: z
    .array(
      z.object({
        carrier: z.string().min(2, "Carrier is required"),
        type: z.enum(shippingMethodTypes).default("standard"),
        cost: z.number().min(0).default(0),
        estimatedDelivery: z.object({
          minDays: z.number().min(0),
          maxDays: z.number().min(0),
        }),
        regions: z.array(z.string()).optional(), // ISO codes
      })
    )
    .optional(),

  restrictions: z
    .object({
      notDeliverableTo: z.array(z.string()).optional(),
      fragile: z.boolean().default(false),
      hazardous: z.boolean().default(false),
    })
    .optional(),

  handlingTimeInDays: z.number().min(0).default(0).optional(),
});