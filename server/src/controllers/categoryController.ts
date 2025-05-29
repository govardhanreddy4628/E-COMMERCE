import Category from "../models/categoryModel";
import { Request, Response } from "express";

export const getAllCategoryController = async (req: Request, res: Response): Promise<void | any> => {
  try {
    const categoryList = await Category.find({}).exec();
    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getSingleCategoryByIdController = async (req: Request, res: Response): Promise<void | any> => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).exec();
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};



export const createCategoryController = async (err:Error, req:Request, res:Response) => {
  try {
    const category = new Category(req.body);
    if(!category){
      res.status(500).json({
        error: err,
        success: false,
      })
    }
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
