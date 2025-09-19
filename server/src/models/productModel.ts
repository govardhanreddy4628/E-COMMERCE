import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
}

interface IQuestion {
  user: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  createdAt?: Date;
}

interface IOffer {
  title: string;
  discountPercentage: number;
  validUntil: Date;
}

interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  costPerItem?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  isFeatured?: boolean;
  warranty?: string;
  productRam?: string[];
  productWeight?: string[];
  productColor?: string[];
  countInStock: number;
  isAvailable?: boolean;
  category: mongoose.Types.ObjectId;
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
  sku?: string;
  barcode?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  returnPolicy?: string;
  offers?: IOffer[];
  reviews?: IReview[];
  questions?: IQuestion[];
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
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },

    price: {
      type: Number,
      required: true,
      min: [1, "wrong min price"],
      max: [100000, "wrong max price"],
    },
    costPerItem: { type: Number, min: 0 },

    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    discountedPrice: {
      type: Number,
      validate: {
        validator: function (val: number) {
          return !val || val < this.price;
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

    warranty: { type: String },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max rating"],
      default: 0,
    },
    isFeatured: { type: Boolean, default: false },
    productRam: { type: [String], default: [] },
    productMeasurement: { type: [String], default: [] },
    productWeight: { type: [String], default: [] },
    productColor: { type: [String], default: [] },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    recentQuantity: { type: Number, min: 0, default: 0 },
    countInStock: { type: Number, min: 0, default: 0 },

    thumbnails: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, "At least one thumbnail required"],
    },
    images: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, "At least one image required"],
    },
    sizes: { 
      type: [Schema.Types.Mixed],       //Schema.Types.Mixed (or just mongoose.Schema.Types.Mixed) defines a Mongoose schema field that holds an array of arbitrary values — in other words, it's an array where each element can be any type (object, string, number, etc.).
      default: []
     },
    highlights: { type: [String], default: [] },
    shipping: { type: Boolean, default: false },

    sku: { type: String, unique: true, index: true },
    barcode: { type: String, unique: true, sparse: true },
    tags: { type: [String], default: [] },

    seoTitle: { type: String, maxlength: 60 },
    seoDescription: { type: String, maxlength: 160 },
    returnPolicy: { type: String },

    offers: [
      {
        title: String,
        discountPercentage: Number,
        validUntil: Date,
      },
    ],

    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    questions: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        question: String,
        answer: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Auto-generate slug before saving  //To ensure unique slugs if multiple products have the same name: This will automatically append -1, -2, etc. to ensure uniqueness.
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  const Product = mongoose.model("Product", productSchema);
  while (await Product.exists({ slug })) {
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


// ✅ Virtual field for final price
productSchema.virtual("finalPrice").get(function () {
  const discount = this.discountPercentage || 0;
  return Math.round(this.price * (1 - discount / 100));
});

const productModel = mongoose.model<IProduct>("Product", productSchema);
export default productModel;




    
   




// const productSchema = new Schema({
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
