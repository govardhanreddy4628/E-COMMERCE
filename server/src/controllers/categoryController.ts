import { Request, Response } from "express";
import { Types } from "mongoose";
import fs from "fs/promises";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import CategoryModel from "../models/categoryModel.js";
import {
  deleteTempFile,
  uploadToCloudinary,
} from "../services/cloudinaryService.js";
import redisClient from "../config/connectRedis.js";

// Configurable limits
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];
const MAX_FILE_SIZE_MB = 5; // 5 MB
const MAX_FILES = 8;

var imagesArr = [];

export async function uploadImages(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (files.length > MAX_FILES) {
      return res.status(400).json({
        message: `Upload limit exceeded. Max ${MAX_FILES} files allowed.`,
      });
    }

    const skippedFiles: { name: string; reason: string }[] = [];
    const validFiles: Express.Multer.File[] = [];

    for (const file of files) {
      const isValidType = ALLOWED_MIME_TYPES.includes(file.mimetype);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      if (!isValidType || !isValidSize) {
        skippedFiles.push({
          name: file.originalname,
          reason: !isValidType ? "Invalid file type" : "File too large",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return res.status(400).json({
        message: "All uploaded files are invalid.",
        skippedFiles,
      });
    }

    const uploadOptions = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      folder: "uploads", // optional
    };

    const results = await Promise.allSettled(
      validFiles.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(
            file.path,
            uploadOptions
          );
          await fs.unlink(file.path);
          return {
            status: "fulfilled" as const,
            url: result.secure_url,
            name: file.originalname,
          };
        } catch (err: any) {
          await fs.unlink(file.path);
          return {
            status: "rejected" as const,
            name: file.originalname,
            reason: err.message || "Upload failed",
          };
        }
      })
    );

    const uploaded = results
      .filter(
        (
          r
        ): r is PromiseFulfilledResult<{
          status: "fulfilled";
          url: string;
          name: string;
        }> => r.status === "fulfilled"
      )
      .map((r) => ({ url: r.value.url, name: r.value.name }));

    const failed = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => ({
        name: (r as any).reason?.name || "Unknown",
        reason: (r as any).reason || "Upload failed",
      }));

    return res
      .status(
        uploaded.length === 0
          ? 500
          : failed.length || skippedFiles.length
          ? 207
          : 200
      )
      .json({
        success: uploaded.length > 0,
        uploaded,
        failed,
        skippedFiles,
        avatar: uploaded[0]?.url || null,
      });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

// Helper: Extract single uploaded file path and mimetype
const extractUploadedFile = (
  files: any
): { path: string; mimetype: string } | null => {
  if (!files) return null;

  if (Array.isArray(files)) return files[0] || null;

  const fileGroups = Object.values(files);
  for (const group of fileGroups) {
    if (Array.isArray(group) && group[0]?.path && group[0]?.mimetype) {
      return { path: group[0].path, mimetype: group[0].mimetype };
    }
  }
  return null;
};

//or

// const extractFilePath = (
//     files: any
//   ): { path: string; mimetype: string } | null => {
//     if (Array.isArray(files)) {
//       return files[0]
//         ? { path: files[0].path, mimetype: files[0].mimetype }
//         : null;
//     }
//     if (typeof files === "object" && files !== null) {
//       const fileGroup = Object.values(files)[0];
//       if (Array.isArray(fileGroup) && fileGroup[0]) {
//         return { path: fileGroup[0].path, mimetype: fileGroup[0].mimetype };
//       }
//     }
//     return null;
//   };

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
      } catch (uploadErr: any) {
        try {
          await deleteTempFile(file.path);
        } catch {}
        console.error("Cloudinary upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary.",
        });
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
      if (redisClient && redisClient.del) {
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
export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, parentCategoryId } = req.body;

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  const category = await CategoryModel.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  // Prevent duplicate names
  if (name && name.trim() !== category.name) {
    const existing = await CategoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category name already exists." });
    }
    category.name = name.trim();
    category.slug = slugify(name.trim(), { lower: true, strict: true });
  }

  if (description) category.description = description;

  // Handle image upload if present
  if (req.file) {
    const file = req.file;

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      await deleteTempFile(file.path);
      return res.status(400).json({ message: "Unsupported file type." });
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      await deleteTempFile(file.path);
      return res
        .status(400)
        .json({ message: `File exceeds ${MAX_FILE_SIZE_MB}MB limit.` });
    }

    try {
      const imageUrl = await uploadToCloudinary(file.path, "categories");
      category.image = imageUrl;
      await deleteTempFile(file.path);
    } catch (err) {
      await deleteTempFile(file.path);
      console.error("Cloudinary upload error:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary." });
    }
  }

  // Handle parent category update
  if (parentCategoryId !== undefined) {
    if (parentCategoryId === null || parentCategoryId === "null") {
      // Remove from old parent's children if exists
      if (category.parentCategoryId) {
        await CategoryModel.findByIdAndUpdate(category.parentCategoryId, {
          $pull: { children: category._id },
        });
      }
      category.parentCategoryId = null;
      category.parentCategoryName = undefined;
      category.level = 0;
    } else {
      if (!Types.ObjectId.isValid(parentCategoryId)) {
        return res.status(400).json({ message: "Invalid parentCategoryId." });
      }

      const parentCategory = await CategoryModel.findById(parentCategoryId);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found." });
      }

      // Remove from old parent's children if parent changed
      if (
        category.parentCategoryId &&
        category.parentCategoryId.toString() !== parentCategoryId
      ) {
        await CategoryModel.findByIdAndUpdate(category.parentCategoryId, {
          $pull: { children: category._id },
        });
      }

      // Add to new parent's children
      await CategoryModel.findByIdAndUpdate(parentCategoryId, {
        $addToSet: { children: category._id },
      });

      category.parentCategoryId = parentCategory._id as Types.ObjectId;
      category.parentCategoryName = parentCategory.name;
      category.level = parentCategory.level + 1;
    }
  }

  await category.save();

  // Invalidate cache
  await redisClient.del(CATEGORY_TREE_KEY);

  return res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    category,
  });
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
