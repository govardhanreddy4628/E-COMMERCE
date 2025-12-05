import { Router } from "express";

import {
  addToCartController,
  getCartItemsController,
  deleteCartItemController,
  updateCartItemController,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authenticate.js";


const cartRouter = Router();

// Helper to wrap async controllers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

cartRouter.post("/add", authenticate(), asyncHandler(addToCartController));

cartRouter.get(
  "/getCart",
  authenticate(),
  asyncHandler(getCartItemsController)
);
cartRouter.delete(
  "/deleteCartItem/:id",
  authenticate(),
  asyncHandler(deleteCartItemController)
);
cartRouter.put(
  "/updateCartItem/:id",
  authenticate(),
  asyncHandler(updateCartItemController)
);

export default cartRouter;
