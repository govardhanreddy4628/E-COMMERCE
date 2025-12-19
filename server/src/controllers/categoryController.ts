import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import fs from "fs/promises";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import CategoryModel from "../models/categoryModel.js";
import {
  destroyCloudinaryById,
  uploadToCloudinary,
} from "../services/cloudinaryService.js";
import redisClient from "../config/connectRedis.js";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_MB,
} from "../config/uploadConfig.js";
import { addAuditLog } from "../lib/audit.js";
import slugify from "slugify";
import productModel from "../models/productModel.js";
import { deleteTempFile } from "../utils/deleteTempFile.js";

const CATEGORY_TREE_KEY = "category_tree";

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    console.log("incoming data:", req.body);
    const { name, description, parentCategoryId } = req.body;

    // ===== Validation =====
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required and must be a non-empty string.",
      });
    }

    // Prevent duplicate names (case-insensitive)
    const existingCategory = await CategoryModel.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    }).lean();

    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists." });
    }

    // ===== Image Upload (optional) =====
    let imageData: any = undefined;

    if (req.file) {
      console.log(req.file);
      const file = req.file;

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        await deleteTempFile(file.path);
        return res.status(400).json({
          success: false,
          message:
            "Unsupported file type. Only JPG, PNG, WEBP, GIF, and SVG are allowed.",
        });
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        await deleteTempFile(file.path);
        return res.status(400).json({
          success: false,
          message: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`,
        });
      }

      try {
        // Upload to Cloudinary and get structured object
        const uploadResult = await uploadToCloudinary(file.path, "categories");
        imageData = {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          size: uploadResult.bytes,
          uploadedAt: new Date(),
          alt: "",
        };
      } catch (err) {
        await deleteTempFile(file.path);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary.",
        });
      } finally {
        await deleteTempFile(file.path);
      }
    }

    // ===== Category Data =====
    const categoryData: any = {
      name: name.trim(),
      slug: slugify(name, { lower: true, strict: true }),
      description: description || null,
      image: imageData || undefined,
      isActive: true,
      isFeatured: false,
      level: 0,
      parentCategoryId: null,
      parentCategoryName: null,
    };

    // ===== Parent Category Handling =====
    let parentId: string | undefined;
    if (parentCategoryId && parentCategoryId !== "null") {
      parentId = String(parentCategoryId);
    }

    if (parentId && parentId !== "null") {
      const parentCategory = await CategoryModel.findById(parentId);
      if (!parentCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Parent category not found." });
      }

      categoryData.parentCategoryId = parentCategory._id;
      categoryData.parentCategoryName = parentCategory.name;
      categoryData.level = parentCategory.level + 1;
    }

    // ===== Create Category =====
    const newCategory = new CategoryModel(categoryData);
    await newCategory.save();

    // Add child reference to parent
    if (parentId) {
      await CategoryModel.findByIdAndUpdate(parentId, {
        $addToSet: { children: newCategory._id },
      });
    }

    // ===== Invalidate Redis Cache =====
    try {
      if (redisClient && typeof redisClient.del === "function") {
        await redisClient.del(CATEGORY_TREE_KEY);
      }
    } catch (redisErr) {
      console.warn("Redis del error:", redisErr);
    }

    // ===== Response =====
    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category: newCategory.toObject(), // ✅ keep image as full object
    });
  } catch (err: any) {
    console.error("Unhandled error in category creation:", err);

    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error, category already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message || JSON.stringify(err) || "Internal server error.",
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/v1/category/:id
 * @access  Admin
 */

const isValidObjectId = (id?: string) => !!(id && Types.ObjectId.isValid(id));

export const updateCategoryController = async (req: Request, res: Response) => {
  console.log("REQ.FILE:", req.file);
  console.log("REQ.BODY:", req.body);

  const categoryId = req.params.id;
  const session = await mongoose.startSession();
  try {
    // 1) Basic validations
    if (!isValidObjectId(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    }

    // 2) Load category (for update) with session
    session.startTransaction();
    const category = await CategoryModel.findById(categoryId).session(session);
    if (!category) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // destructure allowed fields from body
    const { name, description, parentCategoryId, removeImage } = req.body;

    // 3) Duplicate name check (global unique, case-insensitive) - only if name changed
    if (
      typeof name === "string" &&
      name.trim() &&
      name.trim() !== category.name
    ) {
      const existing = await CategoryModel.findOne({
        _id: { $ne: category._id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      })
        .lean()
        .session(session)
        .exec();
      if (existing) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "Category name already exists." });
      }
      // update name + slug
      category.name = name.trim();
      category.slug = slugify(name.trim(), { lower: true, strict: true });
    }

    // 4) Description
    if (description !== undefined) {
      category.description = description || null;
    }

    // 5) IMAGE handling: removeImage flag or file upload
    // removeImage may come as "true" string
    const removeImageFlag = removeImage === true || removeImage === "true";

    // If a new file uploaded: validate and upload
    if (req.file) {
      const file = req.file as Express.Multer.File;
      // validate mime
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        await deleteTempFile(file.path);
        await session.abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "Unsupported file type." });
      }
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        await deleteTempFile(file.path);
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `File exceeds ${MAX_FILE_SIZE_MB}MB limit.`,
        });
      }

      // upload
      try {
        const uploadResult = await uploadToCloudinary(file.path, "categories");
        // remove old cloudinary image if present
        if (category.image?.public_id) {
          try {
            await destroyCloudinaryById(category.image.public_id);
          } catch (err) {
            // log and continue
            console.warn("Old Cloudinary destroy failed:", err);
          }
        }
        // set new image metadata
        category.image = {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          size: uploadResult.bytes,
          uploadedAt: new Date(),
          alt: category.image?.alt || "",
        };
        // push image audit
        category.imageAudit = category.imageAudit || [];
        category.imageAudit.push({
          public_id: uploadResult.public_id,
          action: "replace",
          userId: (req.user as any)?._id || null,
          timestamp: new Date(),
          meta: { source: "upload" },
        });
      } catch (uploadErr: any) {
        await session.abortTransaction();
        console.error("Cloudinary upload error:", uploadErr);
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload image." });
      } finally {
        // cleanup temp
        if (req.file?.path) {
          await deleteTempFile((req.file as any).path);
        }
      }
    } else if (removeImageFlag) {
      // remove stored image if user asked (and delete from cloud)
      if (category.image?.public_id) {
        try {
          await destroyCloudinaryById(category.image.public_id);
        } catch (err) {
          console.warn("Cloudinary destroy failed:", err);
        }
        category.image = null as any;
        category.imageAudit = category.imageAudit || [];
        category.imageAudit.push({
          public_id: undefined,
          action: "delete",
          userId: (req.user as any)?._id || null,
          timestamp: new Date(),
          meta: { reason: "removeImage flag" },
        });
      } else {
        category.image = null as any;
      }
    }
    // else keep existing image

    // 6) Parent update logic (normalize parent)
    const parentProvided = Object.prototype.hasOwnProperty.call(
      req.body,
      "parentCategoryId"
    );

    //Parent update logic — ONLY if parentCategoryId is provided
    if (parentProvided) {
      const normalizedParentId =
        parentCategoryId === "null" ||
        parentCategoryId === null ||
        parentCategoryId === undefined
          ? null
          : String(parentCategoryId).trim();

      const currentParentId = category.parentCategoryId
        ? String(category.parentCategoryId)
        : null;
      const parentChanged =
        (normalizedParentId || null) !== (currentParentId || null);

      if (parentChanged) {
        // If removing parent (move to root)
        if (!normalizedParentId) {
          // remove from old parent's children if exists
          if (category.parentCategoryId) {
            await CategoryModel.findByIdAndUpdate(category.parentCategoryId, {
              $pull: { children: category._id },
            })
              .session(session)
              .exec();
          }
          category.parentCategoryId = null;
          category.parentCategoryName = null;
          category.level = 0;
        } else {
          // validate id
          if (!isValidObjectId(normalizedParentId)) {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ success: false, message: "Invalid parentCategoryId." });
          }
          // ensure parent exists
          const newParent = await CategoryModel.findById(
            normalizedParentId
          ).session(session);
          if (!newParent) {
            await session.abortTransaction();
            return res
              .status(404)
              .json({ success: false, message: "Parent category not found." });
          }

          // Prevent cycle: ensure newParent is NOT a descendant of current category
          const isDescendant = async (
            candidateId: Types.ObjectId,
            targetId: Types.ObjectId
          ): Promise<boolean> => {
            const node = await CategoryModel.findById(candidateId)
              .select("children")
              .lean()
              .session(session)
              .exec();
            if (
              !node ||
              !Array.isArray((node as any).children) ||
              (node as any).children.length === 0
            )
              return false;
            for (const childId of (node as any).children) {
              if (String(childId) === String(targetId)) return true;
              if (await isDescendant(childId as Types.ObjectId, targetId))
                return true;
            }
            return false;
          };

          if (await isDescendant(newParent._id, category._id)) {
            await session.abortTransaction();
            return res.status(400).json({
              success: false,
              message: "Cannot set a descendant as the parent category.",
            });
          }

          // remove from old parent's children if changed
          if (
            category.parentCategoryId &&
            String(category.parentCategoryId) !== normalizedParentId
          ) {
            await CategoryModel.findByIdAndUpdate(category.parentCategoryId, {
              $pull: { children: category._id },
            })
              .session(session)
              .exec();
          }

          // add to new parent's children (idempotent)
          await CategoryModel.findByIdAndUpdate(newParent._id, {
            $addToSet: { children: category._id },
          })
            .session(session)
            .exec();

          // set new parent & level
          category.parentCategoryId = newParent._id;
          category.parentCategoryName = newParent.name;
          category.level = (newParent.level || 0) + 1;
        }

        // If moved levels, update descendant levels recursively
        const updateDescendantLevels = async (
          catId: Types.ObjectId,
          baseLevel: number
        ) => {
          const node = await CategoryModel.findById(catId)
            .select("children")
            .lean()
            .session(session)
            .exec();
          if (!node || !Array.isArray((node as any).children)) return;
          for (const childId of (node as any).children) {
            await CategoryModel.findByIdAndUpdate(childId, {
              $set: { level: baseLevel + 1 },
            })
              .session(session)
              .exec();
            await updateDescendantLevels(
              childId as Types.ObjectId,
              baseLevel + 1
            );
          }
        };

        // update for this category's subtree
        await updateDescendantLevels(category._id, category.level);
      }
    }

    // 7) Save category
    await category.save({ session });

    // 8) Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 9) Invalidate Redis cache (best-effort, outside transaction)
    try {
      if (redisClient && typeof redisClient.del === "function") {
        await redisClient.del(CATEGORY_TREE_KEY);
      }
    } catch (redisErr) {
      console.warn("Redis del error:", redisErr);
    }

    // 10) Add success audit log
    try {
      await addAuditLog?.({
        entity: "category",
        entityId: String(category._id),
        action: "update",
        userId: (req.user as any)?._id || undefined,
        changes: {
          name: category.name,
          parentCategoryId: category.parentCategoryId,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    // 11) Return populated version (one-level children) for frontend convenience
    const updatedCategory = await CategoryModel.findById(category._id)
      .populate({ path: "children", select: "name slug parentCategoryId" })
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (err: any) {
    try {
      await session.abortTransaction();
      session.endSession();
    } catch (e) {
      // ignore
    }
    console.error("Unhandled error in updateCategoryController:", err);
    // Duplicate key (name/slug) handled
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error, category already exists.",
      });
    }
    // return message
    return res.status(500).json({
      success: false,
      message: err?.message || "Internal server error.",
    });
  }
};

/**
 * @desc    Get hierarchical category tree (cached)
 * @route   GET /api/v1/categories/tree
 * @access  Public/Admin
 */
export const getCategoryTree = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // ✅ Check cache first
      const cachedTree = await redisClient.get(CATEGORY_TREE_KEY);
      if (cachedTree) {
        res.status(200).json({
          success: true,
          message: "Category tree fetched from cache",
          data: JSON.parse(cachedTree),
        });
        return;
      }

      // Fetch all active categories
      const categories: any[] = await CategoryModel.find({ isActive: true })
        .lean()
        .sort({ name: 1 }); // optional: sort alphabetically;

      // Build category map
      const categoryMap: Record<string, any> = {};
      categories.forEach((cat) => {
        categoryMap[cat._id.toString()] = { ...cat, children: [] };
      });

      // Build tree
      const tree: any[] = [];
      categories.forEach((cat) => {
        if (
          cat.parentCategoryId &&
          Types.ObjectId.isValid(cat.parentCategoryId)
        ) {
          const parent = categoryMap[cat.parentCategoryId.toString()];
          if (parent) parent.children.push(categoryMap[cat._id.toString()]);
        } else {
          tree.push(categoryMap[cat._id.toString()]);
        }
      });

      // ✅ Save tree to Redis for 1 hour
      await redisClient.set(CATEGORY_TREE_KEY, JSON.stringify(tree), {
        EX: 3600,
      });

      res.status(200).json({
        success: true,
        message: "Category tree fetched successfully",
        data: tree,
      });
    } catch (err: any) {
      console.error("Error fetching category tree:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }
);

export const getAllCategoryController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categoryList: any[] = await CategoryModel.find().lean().exec(); // .lean() is a Mongoose query method that tells Mongoose NOT to create full Mongoose documents, but instead return plain JavaScript objects. Normally, queries like Model.find() return Mongoose documents with lots of extra methods and features (like .save(), getters/setters, virtuals, etc.).

    // Optional: if no categories at all
    if (!categoryList.length) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
        data: [],
        error: true,
      });
    }

    const categoryMap: Record<string, any> = {};
    const rootCategories: any[] = [];

    // Build initial category map with children array
    categoryList.forEach((cat) => {
      categoryMap[cat._id.toString()] = { ...cat, children: [] };
    });

    // Build hierarchy
    categoryList.forEach((cat) => {
      const parentId = cat.parentCategoryId?.toString();

      if (parentId && categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[cat._id.toString()]);
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: rootCategories,
      error: false,
    });
  } catch (err) {
    console.error("Category Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: true,
    });
  }
};

export async function getCategoriesCount(req: Request, res: Response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: { $exists: false },
    });
    // No need to check if (!categoryCount) because countDocuments returns a number, and never null or undefined unless something throws an error — which is already handled in the try/catch.
    return res.status(200).json({
      success: true,
      categoryCount,
      error: false,
    });
  } catch (error) {
    console.error("Error getting category count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get category count",
      error: true,
    });
  }
}

// export async function getSubCategoriesCount(req: Request, res: Response) {
//   try {
//     const categoryCount = await CategoryModel.find();
//     if (!categoryCount) {
//       res.status(500).json({ success: false, error: true });
//     }
//     const subCatList = [];
//     for (let cat of categoryCount) {
//       if (cat.parentCategoryId !== undefined) {
//         subCatList.push(cat);
//       }
//     }
//     res.send({
//       subCategoryCount: subCatList.length,
//     });
//   } catch (error) {}
// }

export async function getSubCategoriesCount(req: Request, res: Response) {
  try {
    const subCategoryCount = await CategoryModel.countDocuments({
      parentId: { $exists: true },
    });

    return res.status(200).json({
      success: true,
      subCategoryCount,
      error: false,
    });
  } catch (error) {
    console.error("Error getting subcategory count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subcategory count",
      error: true,
    });
  }
}

export const getSingleCategoryByIdController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findById(id).exec();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
      error: false,
    });
  } catch (error: any) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: true,
    });
  }
};

export async function deleteCategoryController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found!",
        success: false,
        error: true,
      });
    }

    // 🧹 Delete images from Cloudinary (individually wrapped)
    if (category.image && category.image.length > 0) {
      for (const imgUrl of category.image) {
        try {
          const parts = imgUrl.split("/");
          const imageWithExt = parts[parts.length - 1];
          const publicId = imageWithExt.split(".")[0];

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Cloudinary delete failed for image:", imgUrl, err);
          // Optional: collect errors and return partial failure
        }
      }
    }

    // 🧹 Delete subcategories and third-level subcategories
    const subCategories = await CategoryModel.find({ parentId: id });

    for (const subCat of subCategories) {
      const thirdLevel = await CategoryModel.find({ parentId: subCat._id });

      for (const thirdCat of thirdLevel) {
        try {
          await CategoryModel.findByIdAndDelete(thirdCat._id);
        } catch (err) {
          console.error(
            "Failed to delete third-level subcategory:",
            thirdCat._id,
            err
          );
        }
      }

      try {
        await CategoryModel.findByIdAndDelete(subCat._id);
      } catch (err) {
        console.error("Failed to delete subcategory:", subCat._id, err);
      }
    }

    // 🧹 Delete main category
    try {
      const deletedCat = await CategoryModel.findByIdAndDelete(id);
      if (!deletedCat) {
        res.status(404).json({
          message: "Category not found!",
          success: false,
          error: true,
        });
      }
    } catch (err) {
      console.error("Failed to delete root category:", id, err);
      return res.status(500).json({
        message: "Failed to delete root category",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category and related subcategories deleted successfully!",
      error: false,
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: true,
    });
  }
}

export const permanentDeleteCategoryController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    // ===== Validate ID =====
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    // ===== Fetch Category =====
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const parentId = category.parentCategoryId;

    // ===== OPTIONAL RULE =====
    // Prevent delete if category has products
    // const productCount = await productModel.countDocuments({ categoryId: id });
    // if (productCount > 0) {
    //   return res.status(400).json({
    //    success: false,
    //    message: "Category cannot be deleted because it has linked products.",
    //   });
    // }

    // If category has children → prevent delete
    // If you want to allow delete, skip this block and move children to root.
    const hasChildren = category.children && category.children.length > 0;
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message:
          "This category has subcategories. Remove or reassign them before deleting.",
      });
    }

    // -------------------------
    // If you prefer: Move children to root instead of blocking delete:
    // await CategoryModel.updateMany(
    //   { parentCategoryId: category._id },
    //   { $set: { parentCategoryId: null, parentCategoryName: null, level: 0 } }
    // );
    // -------------------------

    // ===== Remove category reference from parent =====
    if (parentId) {
      await CategoryModel.findByIdAndUpdate(parentId, {
        $pull: { children: category._id },
      }).exec();
    }

    // ===== Delete image from Cloudinary if exists =====
    if (category.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (err) {
        console.warn("Cloudinary delete failed:", err);
      }
    }

    // ===== Delete category document =====
    await CategoryModel.findByIdAndDelete(category._id);

    // ===== Invalidate Redis Cache =====
    try {
      if (redisClient && redisClient.del) {
        await redisClient.del(CATEGORY_TREE_KEY);
      }
    } catch (redisErr) {
      console.warn("Redis del error:", redisErr);
    }

    // ===== Response =====
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      deletedCategoryId: id,
    });
  } catch (err: any) {
    console.error("Unhandled error in deleteCategoryController:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error.",
    });
  }
};

/**
 * @desc    Soft delete a category
 * @route   DELETE /api/v1/category/:id
 * @access  Admin
 */
export const softDeleteCategoryController = async (
  req: Request,
  res: Response
) => {
  const categoryId = req.params.id;
  const session = await mongoose.startSession();

  try {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    }

    session.startTransaction();

    const category = await CategoryModel.findById(categoryId).session(session);
    if (!category) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // ✅ Prevent delete if category has children
    if (category.children && category.children.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with subcategories.",
      });
    }

    // Optional: Soft delete instead of hard delete
    category.isDeleted = true;
    await category.save({ session });

    // Remove from parent's children array if exists
    if (category.parentCategoryId) {
      await CategoryModel.findByIdAndUpdate(
        category.parentCategoryId,
        { $pull: { children: category._id } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Invalidate Redis cache
    try {
      if (redisClient && typeof redisClient.del === "function") {
        await redisClient.del(CATEGORY_TREE_KEY);
      }
    } catch (err) {
      console.warn("Redis del error:", err);
    }

    // Optional: audit log
    try {
      await addAuditLog?.({
        entity: "category",
        entityId: categoryId,
        action: "delete",
        userId: (req.user as any)?._id,
        changes: { isDeleted: true },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      categoryId,
    });
  } catch (err: any) {
    try {
      await session.abortTransaction();
      session.endSession();
    } catch {}
    console.error("Delete category error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Internal server error.",
    });
  }
};

/**
 * @desc    Restore a soft-deleted category
 * @route   PATCH /api/v1/category/:id/restore
 * @access  Admin
 */
export const restoreCategoryController = async (
  req: Request,
  res: Response
) => {
  const categoryId = req.params.id;
  const session = await mongoose.startSession();

  try {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    }

    session.startTransaction();

    const category = await CategoryModel.findById(categoryId).session(session);
    if (!category) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    if (!category.isDeleted) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Category is not deleted." });
    }

    // Restore the category
    category.isDeleted = false;
    await category.save({ session });

    // Re-add to parent's children array if parent exists
    if (category.parentCategoryId) {
      await CategoryModel.findByIdAndUpdate(
        category.parentCategoryId,
        { $addToSet: { children: category._id } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Invalidate Redis cache
    try {
      if (redisClient && typeof redisClient.del === "function") {
        await redisClient.del(CATEGORY_TREE_KEY);
      }
    } catch (err) {
      console.warn("Redis del error:", err);
    }

    // Optional: audit log
    try {
      await addAuditLog?.({
        entity: "category",
        entityId: categoryId,
        action: "restore",
        userId: (req.user as any)?._id,
        changes: { isDeleted: false },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    return res.status(200).json({
      success: true,
      message: "Category restored successfully.",
      categoryId,
    });
  } catch (err: any) {
    try {
      await session.abortTransaction();
      session.endSession();
    } catch {}
    console.error("Restore category error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Internal server error.",
    });
  }
};

export const checkCategoryHasProducts = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  // Check if category exists
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  // Check products referencing this category
  const hasProducts = await productModel.exists({
    category: categoryId,
  });

  return res.json({
    success: true,
    data: { hasProducts: !!hasProducts },
  });
};

export const moveProductsToCategory = async (req: Request, res: Response) => {
  const { fromCategoryId, newCategoryId } = req.body;

  if (!fromCategoryId || !newCategoryId) {
    return res.status(400).json({
      success: false,
      message: "Both fromCategoryId and newCategoryId are required",
    });
  }

  if (fromCategoryId === newCategoryId) {
    return res.status(400).json({
      success: false,
      message: "Cannot move products into the same category",
    });
  }

  // Validate both categories exist
  const fromExists = await CategoryModel.exists({ _id: fromCategoryId });
  const toExists = await CategoryModel.exists({ _id: newCategoryId });

  if (!fromExists || !toExists) {
    return res.status(404).json({
      success: false,
      message: "One or both categories do not exist",
    });
  }

  // Update products
  const result = await productModel.updateMany(
    { category: fromCategoryId },
    { $set: { category: newCategoryId } }
  );

  return res.json({
    success: true,
    message: "Products moved successfully",
    data: {
      movedCount: result.modifiedCount,
    },
  });
};

export const moveSubcategories = async (req: Request, res: Response) => {
  const { fromCategoryId, newParentId } = req.body;

  if (!fromCategoryId) {
    return res.status(400).json({
      success: false,
      message: "fromCategoryId is required",
    });
  }

  // Validate from category exists
  const fromCategory = await CategoryModel.findById(fromCategoryId);
  if (!fromCategory) {
    return res.status(404).json({
      success: false,
      message: "Source category not found",
    });
  }

  // If newParentId is provided, validate it
  if (newParentId) {
    const newParent = await CategoryModel.findById(newParentId);
    if (!newParent) {
      return res.status(404).json({
        success: false,
        message: "Target parent category not found",
      });
    }

    // Prevent moving to self
    if (newParentId === fromCategoryId) {
      return res.status(400).json({
        success: false,
        message: "Cannot move subcategories into the same category",
      });
    }
  }

  // Move subcategories
  const subcategories = await CategoryModel.find({
    parentCategoryId: fromCategoryId,
  });

  if (subcategories.length === 0) {
    return res.json({
      success: true,
      message: "No subcategories to move",
      data: { movedCount: 0 },
    });
  }

  // Update subcategories to point to new parent
  const result = await CategoryModel.updateMany(
    { parentCategoryId: fromCategoryId },
    { $set: { parentCategoryId: newParentId || null } }
  );

  return res.json({
    success: true,
    message: "Subcategories moved successfully",
    data: {
      movedCount: result.modifiedCount,
    },
  });
};
