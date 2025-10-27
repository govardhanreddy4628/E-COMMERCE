// models/Category.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  parentCategoryName?: string | null;
  parentCategoryId?: Types.ObjectId | null;
  children?: Types.ObjectId[];
  level: number;
  isActive: boolean;
  isFeatured: boolean;
  createdBy?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: String,
      validate: {
        validator: (v: string) =>
          !v || /^https?:\/\/.*\.(jpeg|jpg|png|webp|svg|gif)$/.test(v),
        message: "Invalid Image URL",
      },
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: null,
    },
    parentCategoryName: { type: String, default: null },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      validate: {
        // Use a non-arrow function to access `this` if necessary
        validator: async function (value: Types.ObjectId | null) {
          if (!value) return true;
          // Use models lookup to avoid issues during model compilation
          const Category = mongoose.models.Category ?? mongoose.model("Category");
          const exists = await Category.findById(value).lean().exec();
          return !!exists;
        },
        message: "Parent category does not exist",
      },
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: { type: Number, default: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure unique slug generation and handle conflicts
categorySchema.pre<ICategory>("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }
  const baseSlug = slugify(this.name, { lower: true, strict: true }) || "category";
  let slugCandidate = baseSlug;
  const Category = mongoose.models.Category ?? mongoose.model("Category");

  // If slug exists, append a counter
  let i = 0;
  while (await Category.exists({ slug: slugCandidate })) {
    i += 1;
    slugCandidate = `${baseSlug}-${i}`;
  }
  this.slug = slugCandidate;
  next();
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategoryId: 1 });



// categorySchema.virtual('subcategories', {
//   ref: 'Category',
//   localField: '_id',
//   foreignField: 'parentCategoryId',
// });
// categorySchema.set('toObject', { virtuals: true });
// categorySchema.set('toJSON', { virtuals: true });

const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
export default CategoryModel;

