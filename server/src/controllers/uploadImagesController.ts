import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
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
