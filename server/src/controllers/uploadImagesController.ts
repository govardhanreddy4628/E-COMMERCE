import { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


export const uploadImages1 = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "your-folder-name",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Optionally remove temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    const imageUrls = uploadResults.map((result) => result.secure_url);

    return res.status(200).json({
      message: "Images uploaded successfully",
      images: imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload images." });
  }
};





// src/controllers/uploadController.ts
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import { uploadSingle } from "../middleware/multer.js";
import { inngest } from "../inngest/client.js";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_MB, MAX_FILES } from "../config/uploadConfig.js";
import { deleteTempFile } from "../utils/deleteTempFile.js";

/**
 * Backend single upload (e.g. category image) -> multer handles req.file
 * Route: POST /api/v1/upload/category  (uses uploadSingle middleware)
 */
export const uploadCategoryImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploaded = await uploadToCloudinary(req.file.path, "categories");

    // fire an Inngest event for async processing (audit/thumbnail generation etc.)
    await inngest.send({
      name: "product/image.uploaded",
      data: {
        userId: (req as any).user?._id || null,
        public_id: uploaded.public_id,
        url: uploaded.url,
        src: "backend",
      },
    });

    return res.status(200).json({ success: true, image: uploaded });
  } catch (err: any) {
    // ensure temp file removed
    if ((req as any).file?.path) await deleteTempFile((req as any).file.path);
    console.error("uploadCategoryImage error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

/**
 * Signed params endpoint for direct frontend uploads to Cloudinary
 * Route: GET /api/v1/upload/signature?folder=products
 */
export const getSignedUploadParams = (req: Request, res: Response) => {
  try {
    const folder = String(req.query.folder || "products");
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (err: any) {
    console.error("getSignedUploadParams error:", err);
    res.status(500).json({ message: "Failed to generate signature" });
  }
};



// DELETE /api/v1/media/delete
export const deleteTempImageController = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "Missing publicId" });

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("deleteTempImage error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




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

    // Upload each file with safe error handling
    const results = await Promise.allSettled(
      validFiles.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(
            file.path,
            uploadOptions
          );
          await fs.promises.unlink(file.path);
          return {
            status: "fulfilled" as const,
            url: result.secure_url,
            name: file.originalname,
          };
        } catch (err: any) {
          await fs.promises.unlink(file.path); // delete temp file
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
        (r): r is PromiseFulfilledResult<{
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




const extractFirstSingleFileFromUploadedFiles = (
  files: any
): { path: string; mimetype: string } | null => {
  if (!files) return null;

  // -------- Case 1: multer.array() --------
  if (Array.isArray(files)) {
    const f = files[0];
    return f ? { path: f.path, mimetype: f.mimetype } : null;
  }

  // -------- Case 2: multer.fields() --------
  if (typeof files === "object" && files !== null) {
    for (const group of Object.values(files)) {
      if (Array.isArray(group) && group[0]) {
        const f = group[0];
        return f?.path && f?.mimetype
          ? { path: f.path, mimetype: f.mimetype }
          : null;
      }
    }
  }

  return null;
};




const extractAllUploadedFiles = (
  files: any,
  singleFile?: any
): { path: string; mimetype: string }[] => {
  const result: { path: string; mimetype: string }[] = [];

  // -------- Case 1: multer.single() --------
  if (singleFile?.path && singleFile?.mimetype) {
    result.push({ path: singleFile.path, mimetype: singleFile.mimetype });
    return result;
  }

  // -------- Case 2: multer.array() --------
  if (Array.isArray(files)) {
    for (const f of files) {
      if (f?.path && f?.mimetype) {
        result.push({ path: f.path, mimetype: f.mimetype });
      }
    }
    return result;
  }

  // -------- Case 3: multer.fields() --------
  if (typeof files === "object" && files !== null) {
    for (const group of Object.values(files)) {
      if (Array.isArray(group)) {
        for (const f of group) {
          if (f?.path && f?.mimetype) {
            result.push({ path: f.path, mimetype: f.mimetype });
          }
        }
      }
    }
  }

  return result;
};
