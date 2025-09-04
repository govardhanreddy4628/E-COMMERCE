import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  addToCartController,
  getCartItemsController,
  deleteCartItemController,
  updateCartItemController,
} from "../controllers/cartController";

const cartRouter = Router();

//cartRouter.post('/createCart', auth(['user']), addToCartController);
cartRouter.post("/createCart", auth(["user"]), addToCartController);
cartRouter.get("/getCart", auth(["user"]), getCartItemsController);
cartRouter.delete("/deleteCartItem/:id", auth(["user"]), deleteCartItemController);
cartRouter.put("/updateCartItem/:id", auth(["user"]), updateCartItemController);

export default cartRouter;

// // Helper to wrap async controllers and forward errors
// const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// cartRouter.post("/createCart", auth(['user']), asyncHandler(addToCartController));
// cartRouter.get("/getCart", auth(['user']), asyncHandler(getCartItemsController));
// cartRouter.delete("/deleteCartItem/:id", auth(['user']), asyncHandler(deleteCartItemController));
// cartRouter.put("/updateCartItem/:id", auth(['user']), asyncHandler(updateCartItemController));
