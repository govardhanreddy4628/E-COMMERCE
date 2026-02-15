import express from "express";
import {
  checkoutController,
  createProduct,
  createProductController,
  deleteProductController,
  filters,
  getAllProductController,
  getProductsByCategoryId,
  getProductsByCategorySlug,
  getSingleProductByIdController,
  getTopRatedProducts,
  productFiltersController,
  updateProductController,
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
productRouter.put("/update/:id", asyncHandler(updateProductController));

// Frontend direct upload path (client sends product JSON with images array)
productRouter.post("/createproduct", createProduct);

// Backend upload path (multipart form -> multer -> createProduct)
//productRouter.post("/createproduct-server", uploadMultiple, asyncHandler(createProduct));

productRouter.get("/getallproducts", asyncHandler(getAllProductController));
//productRouter.get("/getAllproductsByCatId/:id", getAllProductsByCatIdController);
//productRouter.get("/getAllproductsByCatName", getAllProductsByCatIdController);

productRouter.get("/getproductdetails/:id", asyncHandler(getSingleProductByIdController));
// router.put("/updateproduct", updateProductController)
productRouter.delete("/delete/:id", asyncHandler(deleteProductController));
productRouter.post("/checkout", asyncHandler(checkoutController));

//productRouter.post('/filters', productFiltersController);

productRouter.get("/category/:slug", asyncHandler(getProductsByCategorySlug));
productRouter.get("/category/id/:id", asyncHandler(getProductsByCategoryId));

productRouter.post('/filters', filters)

productRouter.get("/top-rated", asyncHandler(getTopRatedProducts));

export default productRouter;
