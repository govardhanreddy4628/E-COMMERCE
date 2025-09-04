// models/Category.js
import mongoose from 'mongoose';
import slugify from 'slugify';
import { Document, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  images: string[];
  parentCategoryName?: string;
  parentCategoryId?: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    images: [
      {
        type: String,
        validate: {
          validator: (v: string) => /^https?:\/\/.*\.(jpeg|jpg|png|webp|svg)$/.test(v),
          message: 'Image URL must be valid and end with an image extension',
        },
      },
    ],
    parentCategoryName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      validate: {
        validator: async function (value: Types.ObjectId | null) {
          if (value) {
            const exists = await mongoose.model('Category').findById(value);
            return !!exists;
          }
          return true;
        },
        message: 'Parent category does not exist',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate slug from name
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Indexing for performance on frequent queries
// categorySchema.index({ slug: 1 });
// categorySchema.index({ name: 1 });
// categorySchema.index({ parentCategoryId: 1 });


// categorySchema.virtual('subcategories', {
//   ref: 'Category',
//   localField: '_id',
//   foreignField: 'parentCategoryId',
// });
// categorySchema.set('toObject', { virtuals: true });
// categorySchema.set('toJSON', { virtuals: true });

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
