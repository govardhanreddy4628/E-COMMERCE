import cloudinary from "../config/cloudinary";
import fs from "fs/promises";

// ===== Cloudinary Upload Helper =====
export async function uploadToCloudinary(localPath: string, folder = "uploads") {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    await fs.unlink(localPath); // Delete temp file after upload
    return result.secure_url;
  } catch (err) {
    await fs.unlink(localPath).catch(() => {});
    throw new Error("Cloudinary upload failed");
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