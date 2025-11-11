import { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImages = async (req: Request, res: Response) => {
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
import { uploadToCloudinary, deleteTempFile } from "../services/cloudinaryService.js";
import { uploadSingle } from "../middleware/multer.js";
import { inngest } from "../inngest/client.js";

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
