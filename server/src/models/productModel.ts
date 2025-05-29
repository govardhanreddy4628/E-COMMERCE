import mongoose, { Schema } from "mongoose";
import IProduct from "../types/modelTypes.ts/productType";

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, "wrong min price"],
      max: [10000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max price"],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: function (this: IProduct) {
        return Math.round(
          this.price * (1 - (this.discountPercentage ?? 0) / 100)
        );
      },
    },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    // we can use enum for category
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // photo: {
    //     data: Buffer,
    //     contentType: String,
    // },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [Schema.Types.Mixed] },
    sizes: { type: [Schema.Types.Mixed] },
    highlights: { type: [String] },
    shipping: {
      type: Boolean,
    },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

// const productSchema = new Schema({
//     title: { type : String, required: true, unique: true},
//     description: { type : String, required: true},
//     price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
//     discountPercentage: { type: Number, min:[1, 'wrong min discount'], max:[99, 'wrong max discount']},
//     rating: { type: Number, min:[0, 'wrong min rating'], max:[5, 'wrong max price'], default:0},
//     stock: { type: Number, min:[0, 'wrong min stock'], default:0},
//     brand: { type : String, required: true},
//     category: { type : String, required: true},
//     thumbnail: { type : String, required: true},
//     images:{ type : [String], required: true},
//     colors:{ type : [Schema.Types.Mixed] },
//     sizes:{ type : [Schema.Types.Mixed]},
//     highlights:{ type : [String] },
//     discountPrice: { type: Number},
//     deleted: { type : Boolean, default: false},
// })
