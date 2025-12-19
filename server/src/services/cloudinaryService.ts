// services/cloudinaryService.ts
import cloudinary from "../config/cloudinary.js";

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

export async function uploadToCloudinary(
  localPath: string,
  folder = "uploads"
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  });

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
}

export const destroyCloudinaryById = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.warn("Cloudinary destroy error:", err);
  }
};
