import { Request, Response } from "express";
import CartModel from "../models/cartModel.js";
import UserModel from "../models/userModel.js";

// Extend Express Request interface to include 'user'
// declare global {
//     namespace Express {
//         interface Request {
//             user?: string; // or the correct type of user id
//         }
//     }
// }

export const addToCartController = async (req:Request, res:Response) => {
    try {
        const userId = req.userId; // Assuming user ID is stored in req.user
        const { productId, quantity, size, color } = req.body;
        console.log(productId, quantity, size, color)
        if(productId === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Product ID and quantity are required",
                error: true,
                success: false
            });
        }

        const existingCartItem = await CartModel.findOne({
            productId : productId,
            userId : userId
        });

        if(existingCartItem) {
            // If the item already exists in the cart, update the quantity
            existingCartItem.quantity += quantity;
            existingCartItem.size = size;
            existingCartItem.color = color;
            await existingCartItem.save();
        }
        else {
            // If the item does not exist, create a new cart item
            const newCartItem = new CartModel({
                productId,
                quantity,
                userId,
                size,
                color
            });
            await newCartItem.save();
        }

        const updateCartUser = await UserModel.updateOne({_id : userId}, {
            $push: { shopping_cart: productId }
        })

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


    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({
            message: errorMessage,
            error:true,
            success: false
        })
    }
}


export const getCartItemsController = async (req: Request, res: Response) => {
  try {
    console.log("🧩 getCartItemsController called");
    console.log("req.userId =", req.userId);

    const userId = req.userId;

    if (!userId) {
      console.log("❌ No userId found in request");
      return res.status(401).json({
        message: "User not authenticated",
        error: true,
        success: false,
      });
    }

    // 🔍 Log before query
    console.log("🔍 Querying CartModel for userId:", userId);


    const cartItems = await CartModel.find({ userId })
      .populate("productId", "name price images")
      .lean();

    console.log("✅ Cart items found:", cartItems.length);

    if (cartItems.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        error: false,
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Cart items fetched successfully",
      error: false,
      success: true,
      data: cartItems,
    });
  } catch (error: any) {
    console.error("❌ getCartItemsController error:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};




export const updateCartItemController = async(req:Request, res:Response) => {
    try {
        const userId = req.userId;
        const { cartItemId, quantity, size, color } = req.body;
        if(!cartItemId || !quantity){
            return res.status(400).json({
                message: "Cart item ID and quantity are required",
                error: true,
                success: false
            })
        }
        const cartItem = await CartModel.findOne({ _id: cartItemId, userId: userId });
        if(!cartItem) {
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
        await cartItem.save();
        return res.status(200).json({
            message: "Cart item updated successfully",
            error: false,
            success: true,
            data: cartItem
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({
            message: errorMessage,
            error:true,
            success: false
        })
    }
}


export const deleteCartItemController = async(req:Request, res:Response) => {
    try {
        const userId = req.userId;
        const { cartItemId } = req.body;
        if(!cartItemId) {
            return res.status(400).json({
                message: "Cart item ID is required",
                error: true,
                success: false
            });
        }
        const cartItem = await CartModel.findOne({ _id: cartItemId, userId: userId });
        if(!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }
        await CartModel.deleteOne({ _id: cartItemId, userId: userId });
        return res.status(200).json({
            message: "Cart item deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({
            message: errorMessage,
            error:true,
            success: false
        })
    }
}