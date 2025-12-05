import { Router } from "express";
import {
  createCategoryController,
  getAllCategoryController,
  getCategoryTree,
  getSingleCategoryByIdController,
  updateCategoryController,
} from "../controllers/categoryController.js";

import { uploadSingle } from "../middleware/multer.js";
import { setUploadFolder } from "../middleware/setFolderName.js";

const categoryRouter = Router();

// Helper to wrap async controllers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

categoryRouter.post("/create-category", setUploadFolder("categories"), uploadSingle, asyncHandler(createCategoryController));
categoryRouter.post("/update-category", setUploadFolder("categories"), uploadSingle, asyncHandler(updateCategoryController));
//categoryRouter.post('/category', auth, uploadLimiter, createCategoryController);
categoryRouter.get("/tree", getCategoryTree);
categoryRouter.get("/getAllCategory", asyncHandler(getAllCategoryController));
categoryRouter.get("/getSingleCategoryById/:id", asyncHandler(getSingleCategoryByIdController));

export default categoryRouter;

//categoryRouter.get('/', fetchCategories).post('/',createCategory)     *you can define routes like this also
