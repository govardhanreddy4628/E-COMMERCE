import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductByIdController,
  //updateProductController,
} from "../controllers/productController";

const router = express.Router();

router.get("/getAllproduct", getAllProductController);
router.get("/getSingleproduct/:id", getSingleProductByIdController);
router.get("/createproduct", createProductController);
// router.put("/updateproduct", updateProductController)
router.delete("/deleteproduct", deleteProductController);

export default router;
