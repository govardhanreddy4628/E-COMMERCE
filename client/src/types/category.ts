export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  subcategories: Subcategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
}