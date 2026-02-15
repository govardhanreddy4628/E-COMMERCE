import CategoryModel from "../models/categoryModel.js";


export const getCategoryBreadcrumb = async (categoryId: string) => {
  const category = await CategoryModel.findById(categoryId).populate("path");

  if (!category) {
    throw new Error("Category not found");
  }

  return [...category.path, category];
};
