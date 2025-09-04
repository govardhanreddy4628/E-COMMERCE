import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
import slugify from "slugify";

interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercentage?: number;
  discountedPrice?: number;
  isFeatured?: boolean;
  productRam?: string[];
  productWeight?: string[];
  productColor?: string[];
  countInStock: number;
  isAvailable?: boolean;
  category?: mongoose.Types.ObjectId;
  brand: string;
  recentQuantity: number;
  rating?: number;
  thumbnails: string[];
  images: string[];
  colors?: mongoose.Schema.Types.Mixed[];
  productMeasurement?: string[];
  sizes?: any[];
  highlights?: string[];
  status?: "active" | "inactive" | "deleted";
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  shipping?: boolean;
  // photo?: {data: Buffer; contentType: string;};
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, "wrong min price"],
      max: [100000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    discountedPrice: {
      type: Number,
      //required: true,
      min: [1, "wrong min price"],
      max: [100000, "wrong max price"],
      validate: {
        validator: function (val: number) {
          return val < this.price;
        },
        message: "Discounted price must be less than original price",
      },
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Brand name must be at least 2 characters long"],
    },

    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max rating"],
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    productRam: {
      type: [String],
      default: [],
    },
    productMeasurement: {
      type: [String],
      default: null,
    },
    productWeight: {
      type: [String],
      default: null,
    },
    productColor: {
      type: [String],
      default: [],
      trim: true,
      lowerase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    recentQuantity: {
      type: Number,
      min: [0, "wrong min quantity"],
      default: 0,
    },
    countInStock: {
      type: Number,
      min: [0, "wrong min stock"],
      default: 0,
    },
    thumbnails: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        "At least one thumbnail required",
      ],
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        "At least one image required",
      ],
    },
    sizes: {
      type: [Schema.Types.Mixed], //Schema.Types.Mixed (or just mongoose.Schema.Types.Mixed) defines a Mongoose schema field that holds an array of arbitrary values — in other words, it's an array where each element can be any type (object, string, number, etc.).
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    shipping: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

// ✅ Auto-generate slug from name
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  next();
});

//or

//To ensure unique slugs if multiple products have the same name: This will automatically append -1, -2, etc. to ensure uniqueness.
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await productModel.exists({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});


// productSchema.index({ slug: 1 });
// productSchema.index({ category: 1 });
// productSchema.index({ deleted: 1 });
// productSchema.index({ isFeatured: 1 });


productSchema.virtual("finalPrice").get(function () {
  const discount = this.discountPercentage || 0;
  return Math.round(this.price * (1 - discount / 100));
});

export default productModel;

// const productSchema = new Schema({
//     stock: { type: Number, min:[0, 'wrong min stock'], default:0},
//     category: { type : String, required: true},
//     colors:{ type : [Schema.Types.Mixed] },
//     sizes:{ type : [Schema.Types.Mixed]},
//     discountPrice: { type: Number},
//     thumbnail: {
//        data: Buffer,            //MongoDB (especially with Mongoose) allow storing raw binary data (like images, PDFs, etc.) as buffers. It's a way to embed small files directly into the database document, instead of using a file system or a separate storage service.
//        contentType: String,
//     },
// })

// ❗Important: Enable Virtuals in JSON Output
// Mongoose doesn't include virtuals by default in .toJSON() or .toObject().
// const productSchema = new mongoose.Schema<IProduct>(
//   { /* your fields */ },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );
