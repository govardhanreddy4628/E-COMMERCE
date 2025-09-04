"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItemController = exports.updateCartItemController = exports.getCartItemsController = exports.addToCartController = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const addToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user; // Assuming user ID is stored in req.user
        const { productId, quantity, size, color } = req.body;
        if (productId === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Product ID and quantity are required",
                error: true,
                success: false
            });
        }
        const existingCartItem = yield cartModel_1.default.findOne({
            productId: productId,
            userId: userId
        });
        if (existingCartItem) {
            // If the item already exists in the cart, update the quantity
            existingCartItem.quantity += quantity;
            existingCartItem.size = size;
            existingCartItem.color = color;
            yield existingCartItem.save();
        }
        else {
            // If the item does not exist, create a new cart item
            const newCartItem = new cartModel_1.default({
                productId,
                quantity,
                userId,
                size,
                color
            });
            yield newCartItem.save();
        }
        const updateCartUser = yield userModel_1.default.updateOne({ _id: userId }, {
            $push: { shopping_cart: productId }
        });
        // if(updateCartUser.modifiedCount === 0) {
        //     return res.status(400).json({
        //         message: "Failed to update user cart",
        //         error: true,
        //         success: false
        //     });
        // }
        return res.status(200).json({
            message: "Item added to cart successfully",
            error: false,
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
});
exports.addToCartController = addToCartController;
const getCartItemsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user; // Assuming user ID is stored in req.user
        const cartItems = yield cartModel_1.default.find({ userId: userId }).populate('productId'); //This tells Mongoose to replace the productId field in the result with the actual product document referenced in the productId field.
        //const cartItems = await CartModel.find({ userId: userId }).populate('productId', 'name price imageUrl');  // or This tells Mongoose to replace the productId field in the result with the actual product document referenced in the productId field. Only the fields 'name', 'price', and 'imageUrl' will be fetched from the Product collection (to avoid fetching unnecessary data).
        if (cartItems.length === 0) {
            return res.status(404).json({
                message: "No items found in the cart",
                error: true,
                success: false
            });
        }
        return res.status(200).json({
            message: "Cart items fetched successfully",
            error: false,
            success: true,
            data: cartItems
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
});
exports.getCartItemsController = getCartItemsController;
const updateCartItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { cartItemId, quantity, size, color } = req.body;
        if (!cartItemId || !quantity) {
            return res.status(400).json({
                message: "Cart item ID and quantity are required",
                error: true,
                success: false
            });
        }
        const cartItem = yield cartModel_1.default.findOne({ _id: cartItemId, userId: userId });
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }
        // Update the cart item
        cartItem.quantity = quantity;
        cartItem.size = size;
        cartItem.color = color;
        yield cartItem.save();
        return res.status(200).json({
            message: "Cart item updated successfully",
            error: false,
            success: true,
            data: cartItem
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
});
exports.updateCartItemController = updateCartItemController;
const deleteCartItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { cartItemId } = req.body;
        if (!cartItemId) {
            return res.status(400).json({
                message: "Cart item ID is required",
                error: true,
                success: false
            });
        }
        const cartItem = yield cartModel_1.default.findOne({ _id: cartItemId, userId: userId });
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }
        yield cartModel_1.default.deleteOne({ _id: cartItemId, userId: userId });
        return res.status(200).json({
            message: "Cart item deleted successfully",
            error: false,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
});
exports.deleteCartItemController = deleteCartItemController;
