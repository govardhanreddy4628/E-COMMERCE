import { Request, Response } from "express";
import CartModel from "../models/cartModel";
import UserModel from "../models/userModel";

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
        const userId = req.user; // Assuming user ID is stored in req.user
        const { productId, quantity, size, color } = req.body;

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
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const getCartItemsController = async(req:Request, res:Response) => {
    try {
        const userId = req.user; // Assuming user ID is stored in req.user
        const cartItems = await CartModel.find({ userId: userId }).populate('productId');  //This tells Mongoose to replace the productId field in the result with the actual product document referenced in the productId field.
        //const cartItems = await CartModel.find({ userId: userId }).populate('productId', 'name price imageUrl');  // or This tells Mongoose to replace the productId field in the result with the actual product document referenced in the productId field. Only the fields 'name', 'price', and 'imageUrl' will be fetched from the Product collection (to avoid fetching unnecessary data).
        if(cartItems.length === 0) {
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
    
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }
}


export const updateCartItemController = async(req:Request, res:Response) => {
    try {
        const userId = req.user;
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
        res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}


export const deleteCartItemController = async(req:Request, res:Response) => {
    try {
        const userId = req.user;
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
        res.status(500).json({
            message: error.message || error,
            error:true,
            success: false
        })
    }
}