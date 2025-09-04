import { Router } from "express";
import {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryByIdController,
} from "../controllers/categoryController";
import { auth } from "../middleware/auth";
import upload from "../middleware/multer";
import { uploadLimiter } from "../middleware/rateLimiter";
import { Roles } from "../constants";

const categoryRouter = Router();




// Helper to wrap async controllers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

categoryRouter.post('/create-category', auth([Roles.USER]), upload.array('image'), asyncHandler(createCategoryController));
//categoryRouter.post('/category', auth, uploadLimiter, createCategoryController);
categoryRouter.get("/getAllCategory", asyncHandler(getAllCategoryController));
categoryRouter.get("/getSingleCategoryById/:id", asyncHandler(getSingleCategoryByIdController));

export default categoryRouter;

//categoryRouter.get('/', fetchCategories).post('/',createCategory)     *you can define routes like this also
