import { Router } from "express";
import {
  checkCategoryHasProducts,
  createCategoryController,
  getAllCategoryController,
  getCategoryTree,
  getSingleCategoryByIdController,
  moveProductsToCategory,
  moveSubcategories,
  updateCategoryController,
} from "../controllers/categoryController.js";

import { uploadSingle } from "../middleware/multer.js";
import { setUploadFolder } from "../middleware/setFolderName.js";

const categoryRouter = Router();

// Helper to wrap async controllers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

categoryRouter.post("/create", setUploadFolder("categories"), uploadSingle, asyncHandler(createCategoryController));
categoryRouter.put("/update/:id", setUploadFolder("categories"), uploadSingle, asyncHandler(updateCategoryController));
//categoryRouter.post('/category', auth, uploadLimiter, createCategoryController);
categoryRouter.get("/tree", getCategoryTree);
categoryRouter.get("/getAllCategory", asyncHandler(getAllCategoryController));
categoryRouter.get("/getSingleCategoryById/:id", asyncHandler(getSingleCategoryByIdController));

categoryRouter.get("/:categoryId/has-products", asyncHandler(checkCategoryHasProducts));

categoryRouter.patch("/move-products", asyncHandler(moveProductsToCategory));
categoryRouter.patch("/move-subcategories", asyncHandler(moveSubcategories));

export default categoryRouter;

//categoryRouter.get('/', fetchCategories).post('/',createCategory)     *you can define routes like this also
