import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

// ===== Cloudinary Upload Helper =====
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
  resource_type: string;
}

export async function  uploadToCloudinary(
  localPath: string,
  folder = "uploads"
) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    await fs.unlink(localPath); // Delete temp file after upload
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
      resource_type: result.resource_type,
    };
  } catch (err) {
    // attempt to delete local file if it exists
    await fs.unlink(localPath).catch(() => {});
    // throw original error to let controller decide status code & message
    throw err;
  }
}

// =============Safely deletes a temporary file (used when validation or upload fails)
export async function deleteTempFile(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // Avoid crashing if file was already deleted or path invalid
    console.warn(`⚠️ Failed to delete temp file: ${filePath}`, err);
  }
}



export const destroyCloudinaryById = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.warn("cloudinary destroy error:", err);
  }
};