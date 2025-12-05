import { Category } from "../types/category";

// ✅ Utility to safely get ID (works for both id and _id)
export const getCategoryId = (cat: Category) => String(cat.id ?? cat._id ?? Math.random().toString(36).substr(2, 9));