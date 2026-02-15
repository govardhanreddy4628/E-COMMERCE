export interface ProductImage {
  _id: string;
  public_id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
  uploadedAt: string;
  alt: string;
  role: "thumbnail" | "gallery" | string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}


export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  category: ProductCategory;
  finalPrice: number;
  listedPrice?: number;
  discountPercentage?: number;
  brand: string;
  isFeatured: boolean;
  quantityInStock: number;
  images: ProductImage[];
  rating: number;
  status: "active" | "inactive" | "discontinued" | "archived";
  createdAt: string;
  slug: string;
}