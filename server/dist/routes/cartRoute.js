"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const cartController_1 = require("../controllers/cartController");
const cartRouter = (0, express_1.Router)();
//cartRouter.post('/createCart', auth(['user']), addToCartController);
cartRouter.post("/createCart", (0, auth_1.auth)(["user"]), cartController_1.addToCartController);
cartRouter.get("/getCart", (0, auth_1.auth)(["user"]), cartController_1.getCartItemsController);
cartRouter.delete("/deleteCartItem/:id", (0, auth_1.auth)(["user"]), cartController_1.deleteCartItemController);
cartRouter.put("/updateCartItem/:id", (0, auth_1.auth)(["user"]), cartController_1.updateCartItemController);
exports.default = cartRouter;
// // Helper to wrap async controllers and forward errors
// const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
// cartRouter.post("/createCart", auth(['user']), asyncHandler(addToCartController));
// cartRouter.get("/getCart", auth(['user']), asyncHandler(getCartItemsController));
// cartRouter.delete("/deleteCartItem/:id", auth(['user']), asyncHandler(deleteCartItemController));
// cartRouter.put("/updateCartItem/:id", auth(['user']), asyncHandler(updateCartItemController));
