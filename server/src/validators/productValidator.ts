import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  shortDescription: z.string().min(5).max(500),
  description: z.string().min(10),
  category: z.string(), // ObjectId as string
  subcategory: z.string(), // ObjectId as string
  price: z.number().min(1).max(200000),
  discountPercentage: z.number().min(1).max(99).optional(),
  discountedPrice: z.number().min(1).max(100000).optional(),
  brand: z.string().min(2).max(100),
  thumbnails: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
  sku: z.string().optional(), // optional → backend generates if missing
  isFeatured: z.boolean().optional(),
  productRam: z.array(z.string()).optional(),
  costPerItem: z.number().optional(),
  productMeasurement: z.array(z.string()).optional(),
  productWeight: z.array(z.string()).optional(),
  productColor: z.array(z.string()).optional(),
  sizes: z.array(z.any()).optional(),
  highlights: z.array(z.string()).optional(),
  shipping: z.boolean().optional(),
  status: z.enum(["active", "inactive", "deleted"]).optional(),
  recentQuantity: z.number().min(0).optional(),
  countInStock: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  warranty: z.string().optional(),
  offers: z.array(z.string()).optional(),
  returnPolicy: z.string().optional(),
  barcode: z.string().optional(),
  productSeoTags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
