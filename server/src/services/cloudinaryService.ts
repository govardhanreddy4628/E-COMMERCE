// src/services/cloudinaryService.ts
import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (filePath: string, folder?: string) => {
  try {
    return await cloudinary.uploader.upload(filePath, { folder: folder || 'uploads' });
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
