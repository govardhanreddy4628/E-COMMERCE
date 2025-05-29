import { NextFunction, Request, Response } from "express";
import {Product} from "../models/productModel";

export const getAllProductController = async (req: Request, res: Response, next:NextFunction): Promise<void | any> => {
  try {
    const productList = await Product.find();
    if (!productList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json(productList);
  } 
  catch (error) {
    // if (error instanceof Error) {
    //   res.status(500).json({ success: false, error: error.message });
    // } else {
    // res.status(500).json({ success: false, error: "Unknown error occurred" });
    // } 
    console.log(error)
  }
};





export const createProductController = async (req:Request, res: Response) : Promise<void | any>=> {
  // this product we have to get from API body
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}


export const getSingleProductByIdController = async (req:Request, res: Response): Promise<void | any> => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
}


// export const updateProductController = async (req:Request, res: Response): Promise<void | any> => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
//     product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
//     const updatedProduct = await product.save()
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }


export const deleteProductController = async (req:Request, res: Response): Promise<void | any> => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
}



