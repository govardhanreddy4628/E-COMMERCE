import express from "express";
import { createCategoryController, getAllCategoryController, getSingleCategoryByIdController } from "../controllers/categoryController";

const router = express.Router();

router.get("/getAllCategory", getAllCategoryController);
//router.get('/', fetchCategories).post('/',createCategory)

router.get("/getSingleCategoryById/:id", getSingleCategoryByIdController);
router.post("/createCategory", createCategoryController);

export default router;