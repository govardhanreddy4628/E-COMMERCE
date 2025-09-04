import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import CategoryModel from "../models/categoryModel";
import fs from "fs/promises";
import slugify from "slugify";

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
      return res
        .status(400)
        .json({
          message: `Upload limit exceeded. Max ${MAX_FILES} files allowed.`,
        });
    }

    const validFiles = files.filter((file) => {
      const isValidType = ALLOWED_MIME_TYPES.includes(file.mimetype);
      const isValidSize = file.size / (1024 * 1024) <= MAX_FILE_SIZE_MB;

      return isValidType && isValidSize;
    });

    const skippedFiles = files
      .filter((f) => !validFiles.includes(f))
      .map((f) => ({
        name: f.originalname,
        reason: !ALLOWED_MIME_TYPES.includes(f.mimetype)
          ? "Invalid file type"
          : "File too large",
      }));

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
    };

    const uploadResults = await Promise.allSettled(
      validFiles.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(
            file.path,
            uploadOptions
          );
          await fs.unlink(file.path);
          return {
            success: true,
            url: result.secure_url,
            name: file.originalname,
          };
        } catch (err) {
          await fs.unlink(file.path); // clean up even on failure
          return { success: false, error: err, name: file.originalname };
        }
      })
    );

    const uploaded = uploadResults
      .filter((r) => r.status === "fulfilled" && r.value.success)
      .map((r: any) => ({ url: r.value.url, name: r.value.name }));

    const failed = uploadResults
      .filter((r) => r.status === "fulfilled" && !r.value.success)
      .map((r: any) => ({
        name: r.value.name,
        reason: r.value.error?.message || "Upload failed",
      }));

    return res.status(200).json({
      success: true,
      uploaded,
      failed,
      skippedFiles,
      avatar: uploaded[0]?.url || null,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: error?.message || "Server error",
      error: true,
      success: false,
    });
  }
}

// export async function uploadImages(req: Request, res: Response) {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: 'No files uploaded' });
//     }

//     if (files.length > MAX_FILES) {
//       return res.status(400).json({ message: `Upload limit exceeded. Max ${MAX_FILES} files allowed.` });
//     }

//     const skippedFiles: { name: string; reason: string }[] = [];
//     const validFiles: Express.Multer.File[] = [];

//     for (const file of files) {
//       const isValidType = ALLOWED_MIME_TYPES.includes(file.mimetype);
//       const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

//       if (!isValidType || !isValidSize) {
//         skippedFiles.push({
//           name: file.originalname,
//           reason: !isValidType ? 'Invalid file type' : 'File too large',
//         });
//         continue;
//       }

//       validFiles.push(file);
//     }

//     if (validFiles.length === 0) {
//       return res.status(400).json({
//         message: 'All uploaded files are invalid.',
//         skippedFiles,
//       });
//     }

//     const uploadOptions = {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: false,
//       folder: 'uploads', // optional
//     };

//     const results = await Promise.allSettled(
//       validFiles.map(async (file) => {
//         try {
//           const result = await cloudinary.uploader.upload(file.path, uploadOptions);
//           await fs.unlink(file.path);
//           return {
//             status: 'fulfilled' as const,
//             url: result.secure_url,
//             name: file.originalname,
//           };
//         } catch (err: any) {
//           await fs.unlink(file.path);
//           return {
//             status: 'rejected' as const,
//             name: file.originalname,
//             reason: err.message || 'Upload failed',
//           };
//         }
//       })
//     );

//     const uploaded = results
//       .filter((r): r is { status: 'fulfilled'; url: string; name: string } => r.status === 'fulfilled')
//       .map((r) => ({ url: r.url, name: r.name }));

//     const failed = results
//       .filter((r): r is { status: 'rejected'; name: string; reason: string } => r.status === 'rejected')
//       .map((r) => ({ name: r.name, reason: r.reason }));

//     return res.status(uploaded.length === 0 ? 500 : failed.length || skippedFiles.length ? 207 : 200).json({
//       success: uploaded.length > 0,
//       uploaded,
//       failed,
//       skippedFiles,
//       avatar: uploaded[0]?.url || null,
//     });

//   } catch (error: any) {
//     console.error('Upload error:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// }



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
export const createCategoryController = async (req: Request, res: Response) => {

  try {
    const { name, parentCategoryId, parentCategoryName } = req.body;

    // ✅ Validate required fields
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Category name is required and must be a string." });
    }

    if (!req.files) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    //  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    //   return res.status(400).json({ error: 'No image file uploaded.' });
    // }

    const file = extractUploadedFile(req.files);
    if (!file?.path || !file.mimetype) {
      return res.status(400).json({ error: "Invalid or missing image file." });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      await fs.unlink(file.path).catch(() => {});
      return res
        .status(400)
        .json({ error: "Unsupported file type. Use JPG, PNG, or WEBP." });
    }

    const stats = await fs.stat(file.path);
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      await fs.unlink(file.path).catch(() => {});
      return res
        .status(400)
        .json({ error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.` });
    }

    // ✅ Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "categories",
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      await fs.unlink(file.path).catch(() => {});
      return res
        .status(502)
        .json({ error: "Failed to upload image to Cloudinary." });
    }

    // ✅ Clean up local file
    await fs.unlink(file.path).catch((err) => {console.warn(`Failed to delete file ${file.path}:`, err);});
    // //or
    // const deleteLocalFile = async (filePath: string) => {
    //   try {
    //     await fs.unlink(filePath);
    //   } catch (err) {
    //     console.warn(`Failed to delete file ${filePath}:`, err);
    //   }
    // };
    // await deleteLocalFile(file.path);

    const newCategory = new CategoryModel({
      name: name.trim(),
      slug: slugify(name, { lower: true, strict: true }),
      images: [uploadResult.secure_url],
      parentCategoryId: parentCategoryId || null,
      parentCategoryName: parentCategoryName || null,
      createdBy: req.userId || null, // Optional: Use auth middleware to inject this
    });

    // ✅ Save to DB
    try {
      const saved = await newCategory.save();
      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: saved,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res
        .status(500)
        .json({ error: "Failed to save category to database." });
    }
  } catch (err: any) {
    console.error("Unhandled error in category creation:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};




export const getAllCategoryController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categoryList = await CategoryModel.find().lean().exec(); // .lean() is a Mongoose query method that tells Mongoose NOT to create full Mongoose documents, but instead return plain JavaScript objects. Normally, queries like Model.find() return Mongoose documents with lots of extra methods and features (like .save(), getters/setters, virtuals, etc.).

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

// export const getAllCategoryController = async (req: Request, res: Response): Promise<void | any> => {
//   try {
//     const categoryList = await CategoryModel.find({}).exec();
//     const categoryMap = {};

//     if (!categoryList) {
//       res.status(500).json({ success: false });
//     }

//     categoryList.forEach(cat => {
//       categoryMap[cat._id] = {...cat._doc, children: []};
//     });

//     const rootCategories = [];

//     categoryList.forEach(cat => {
//       if(cat.parentCategoryId) {
//         categoryMap[cat.parentCategoryId].children.push(categoryMap[cat._id])
//       } else{
//         rootCategories.push(categoryMap[cat._id])
//       }
//     })
//     res.status(200).send(rootCategories);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

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
    if (category.images && category.images.length > 0) {
      for (const imgUrl of category.images) {
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
