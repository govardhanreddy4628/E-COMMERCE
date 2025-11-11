import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  addToCartController,
  getCartItemsController,
  deleteCartItemController,
  updateCartItemController,
} from "../controllers/cartController.js";

const cartRouter = Router();

// Helper to wrap async controllers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

cartRouter.post("/createCart", auth(['user']), asyncHandler(addToCartController));
cartRouter.get("/getCart", auth(['user']), asyncHandler(getCartItemsController));
cartRouter.delete("/deleteCartItem/:id", auth(['user']), asyncHandler(deleteCartItemController));
cartRouter.put("/updateCartItem/:id", auth(['user']), asyncHandler(updateCartItemController));

export default cartRouter;