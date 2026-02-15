import { Request, Response } from "express";
import CartModel from "../models/cartModel.js";
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const getCartItemsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cartItems = await CartModel.find({ userId })
      .populate("productId", "name price images discount")
      .lean();

    return res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const addToCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({success: false, message: "User not authenticated" });
    }

    const { productId, quantity=1, size, color } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
        error: true,
        success: false,
      });
    }

     const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.quantityInStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantityInStock} items available`,
      });
    }

    const existingCartItem = await CartModel.findOne({
      productId,
      userId,
      size: size || null,
      color: color || null,
    });

     // 🗑 Auto remove if quantity = 0
    if (quantity === 0) {
      if (existingCartItem) {
        await CartModel.deleteOne({ _id: existingCartItem._id });
      }

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    }

    const newExpiryDate = new Date(
      Date.now() + 60 * 24 * 60 * 60 * 1000
    );

    if (existingCartItem) {
      const updatedQuantity = existingCartItem.quantity + quantity;

      if (updatedQuantity > product.quantityInStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.quantityInStock} items available`,
        });
      }

      existingCartItem.quantity = updatedQuantity;
      existingCartItem.expiresAt = newExpiryDate; // ✅ reset expiration
      await existingCartItem.save();

       return res.status(200).json({
        success: true,
        message: "Cart updated",
        data: existingCartItem,
      });
    } 

     // ➕ Create new cart item
    const newCartItem = await CartModel.create({
      userId,
      productId,
      quantity,
      size: size || null,
      color: color || null,
      expiresAt: newExpiryDate, // ✅ set expiration
    });

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      cartItemId: newCartItem._id,
    });

  } catch (error: any) {
    console.error("Cart Error:", error);
    return res.status(500).json({
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

    const { cartItemId } = req.params;


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



export const updateCartItemController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { quantity, size, color } = req.body;
    const { cartItemId } = req.params;

    if (!cartItemId || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    if (quantity <= 0) {
      await CartModel.deleteOne({ _id: cartItemId, userId });
      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    }

    const cartItem = await CartModel.findOneAndUpdate(
      { _id: cartItemId, userId },
      {
        quantity,
        ...(size && { size }),
        ...(color && { color }),
      },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cartItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateCartQuantityController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (quantity > product.quantityInStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantityInStock} items available`,
      });
    }

    const cartItem = await CartModel.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity === 0) {
      await CartModel.deleteOne({ _id: cartItem._id });
      return res.json({ success: true, message: "Item removed" });
    }

    cartItem.quantity = quantity;
    cartItem.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    await cartItem.save();

    return res.json({ success: true, message: "Quantity updated", data: cartItem });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// POST /cart/merge
export const mergeCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { items } = req.body;

    for (const item of items) {
      const { productId, quantity } = item;

      const product = await productModel.findById(productId);
      if (!product) continue;

      const existing = await CartModel.findOne({
        userId,
        productId,
      });

      if (existing) {
        const newQty = existing.quantity + quantity;

        existing.quantity = Math.min(
          newQty,
          product.quantityInStock
        );
        await existing.save();
      } else {
        await CartModel.create({
          userId,
          productId,
          quantity: Math.min(quantity, product.quantityInStock),
        });
      }
    }

    // ✅ RETURN FULL CART (REQUIRED FOR FRONTEND)
    const finalCart = await CartModel.find({ userId })
      .populate("productId")
      .lean();

    return res.json({
      success: true,
      data: finalCart, // ✅ IMPORTANT
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

