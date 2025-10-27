import express from "express";
import {
  checkoutController,
  createProduct,
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductByIdController,
  //updateProductController,
} from "../controllers/productController";
import { auth } from "../middleware/auth";
import { Roles } from "../constants";

const productRouter = express.Router();


const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);
productRouter.post("/create", createProductController);
productRouter.post("/createproduct", asyncHandler(createProduct));
//productRouter.get("/getAllproduct", getAllProductController);
//productRouter.get("/getAllproductsByCatId/:id", getAllProductsByCatIdController);
//productRouter.get("/getAllproductsByCatName", getAllProductsByCatIdController);



//productRouter.get("/getSingleproduct/:id", getSingleProductByIdController);
// router.put("/updateproduct", updateProductController)
productRouter.delete("/deleteproduct", deleteProductController);
productRouter.post('/checkout', asyncHandler(checkoutController));


export default productRouter;
