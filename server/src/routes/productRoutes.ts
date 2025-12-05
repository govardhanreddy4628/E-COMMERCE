import express from "express";
import {
  checkoutController,
  createProduct,
  createProductController,
  deleteProductController,
  filters,
  getAllProductController,
  getSingleProductByIdController,
  productFiltersController,
  //updateProductController,
} from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";

import { uploadMultiple } from "../middleware/multer.js";

const productRouter = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);
productRouter.post("/create", createProductController);

// Frontend direct upload path (client sends product JSON with images array)
productRouter.post("/createproduct", createProduct);

// Backend upload path (multipart form -> multer -> createProduct)
//productRouter.post("/createproduct-server", uploadMultiple, asyncHandler(createProduct));

productRouter.get("/getallproducts", getAllProductController);
//productRouter.get("/getAllproductsByCatId/:id", getAllProductsByCatIdController);
//productRouter.get("/getAllproductsByCatName", getAllProductsByCatIdController);

//productRouter.get("/getSingleproduct/:id", getSingleProductByIdController);
// router.put("/updateproduct", updateProductController)
productRouter.delete("/deleteproduct", deleteProductController);
productRouter.post("/checkout", asyncHandler(checkoutController));

//productRouter.post('/filters', productFiltersController);

productRouter.post('/filters', filters)

export default productRouter;
