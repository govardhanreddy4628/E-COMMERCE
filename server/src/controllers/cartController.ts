import { Request, Response } from "express";
import CartModel from "../models/cartModel.js";
import UserModel from "../models/userModel.js";

export const addToCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { productId, quantity, size, color } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
        error: true,
        success: false,
      });
    }

    const existingCartItem = await CartModel.findOne({
      productId,
      userId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.size = size;
      existingCartItem.color = color;
      await existingCartItem.save();
    } else {
      await CartModel.create({
        productId,
        quantity,
        userId,
        size,
        color,
      });
    }

    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    return res.status(200).json({
      message: "Item added to cart successfully",
      error: false,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getCartItemsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        error: true,
        success: false,
      });
    }

    const cartItems = await CartModel.find({ userId })
      .populate("productId", "name price images")
      .lean();

    return res.status(200).json({
      message: "Cart items fetched successfully",
      error: false,
      success: true,
      data: cartItems,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { cartItemId, quantity, size, color } = req.body;

    if (!cartItemId || !quantity) {
      return res.status(400).json({
        message: "Cart item ID and quantity are required",
        error: true,
        success: false,
      });
    }

    const cartItem = await CartModel.findOne({
      _id: cartItemId,
      userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        error: true,
        success: false,
      });
    }

    cartItem.quantity = quantity;
    cartItem.size = size;
    cartItem.color = color;
    await cartItem.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      error: false,
      success: true,
      data: cartItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const deleteCartItemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { cartItemId } = req.body;

    if (!cartItemId) {
      return res.status(400).json({
        message: "Cart item ID is required",
        error: true,
        success: false,
      });
    }

    const cartItem = await CartModel.findOne({
      _id: cartItemId,
      userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        error: true,
        success: false,
      });
    }

    await CartModel.deleteOne({ _id: cartItemId, userId });

    return res.status(200).json({
      message: "Cart item deleted successfully",
      error: false,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
