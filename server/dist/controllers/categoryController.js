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
exports.getSingleCategoryByIdController = exports.getAllCategoryController = exports.createCategoryController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const createCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "No image file uploaded." });
        }
        const file = req.file.path;
        let uploadResult;
        try {
            uploadResult = yield cloudinary_1.default.uploader.upload(file, {
                folder: "uploads",
            });
        }
        catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(502).json({ error: "Failed to upload image to Cloudinary." });
        }
        const imagesArr = [uploadResult.secure_url];
        const category = new categoryModel_1.default({
            name: req.body.name,
            images: imagesArr,
            color: req.body.color,
            parentCategoryId: req.body.parentCategoryId,
            parentCategoryName: req.body.parentCategoryName,
            createdBy: userId,
        });
        try {
            yield category.save();
        }
        catch (dbError) {
            console.error("Database save error:", dbError);
            return res.status(500).json({ error: "Failed to save category to database." });
        }
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Unexpected server error." });
    }
});
exports.createCategoryController = createCategoryController;
// export const createCategoryController = async (err:Error, req:Request, res:Response) => {
//   try {
//     const category = new Category(req.body);
//     if(!category){
//       res.status(500).json({
//         error: err,
//         success: false,
//       })
//     }
//     const doc = await category.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
const getAllCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryList = yield categoryModel_1.default.find({}).exec();
        if (!categoryList) {
            res.status(500).json({ success: false });
        }
        res.status(200).send(categoryList);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.getAllCategoryController = getAllCategoryController;
const getSingleCategoryByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield categoryModel_1.default.findById(id).exec();
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.getSingleCategoryByIdController = getSingleCategoryByIdController;
