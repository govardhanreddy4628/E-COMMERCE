// src/types/category.ts

export interface Category {
  _id?: string; // MongoDB id
  id?: string;  // Normalized id for frontend
  name: string;
  description?: string;
  image?: string;
  parentCategoryId?: string | null;
  subcategories: Category[];
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentCategoryId?: string | null;
  imageFile?: File;
}
