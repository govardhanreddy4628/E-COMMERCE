import {Router} from "express";
import { deleteImageController, uploadImages } from "../controllers/uploadImagesController.js";
import { uploadCategoryImage, getSignedUploadParams } from "../controllers/uploadImagesController.js";
import { uploadSingle } from "../middleware/multer.js";

const uploadRouter = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Define the route for uploading images
uploadRouter.post("/upload1", asyncHandler(uploadImages));

// Signed params for direct client uploads
uploadRouter.get("/signature", getSignedUploadParams);

uploadRouter.delete("/delete", asyncHandler(deleteImageController));

// Backend single image upload (admin/category)
uploadRouter.post("/category", uploadSingle, asyncHandler(uploadCategoryImage));


export default uploadRouter;