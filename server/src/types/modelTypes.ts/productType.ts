import mongoose, {Document} from "mongoose";

export default interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  brand: string;
  quantity: number;
  stock: number;
  rating?: number;
  thumbnail: string;
  // photo?: {
  //   data: Buffer;
  //   contentType: string;
  // };
  images: string[];
  colors?: mongoose.Schema.Types.Mixed[];
  sizes?: mongoose.Schema.Types.Mixed[];
  highlights?: string[];
  deleted?: boolean;
  createdAt?: Date;
  shipping?: boolean;
}