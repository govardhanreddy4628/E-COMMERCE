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
exports.deleteProductController = exports.getSingleProductByIdController = exports.getAllProductController = exports.createProductController = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const allowedFields = ['name', 'price', 'category']; // Only allowed fields
    // const filteredBody = {};
    // for (const field of allowedFields) {
    //   if (req.body[field] !== undefined) {
    //     filteredBody[field] = req.body[field];
    //   }
    // }
    // const product = new productModel(filteredBody);
    // this product we have to get from API body
    const product = new productModel_1.default(req.body);
    product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    try {
        const doc = yield productModel_1.default.save();
        res.status(201).json(doc);
    }
    catch (error) {
        res.status(500).json({
            message: (error instanceof Error ? error.message : String(error)),
            success: false,
            error: true,
            data: null,
        });
    }
});
exports.createProductController = createProductController;
const getAllProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = yield productModel_1.default.find();
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
        console.log(error);
    }
});
exports.getAllProductController = getAllProductController;
const getSingleProductByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield productModel_1.default.findById(id);
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json(product);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.getSingleProductByIdController = getSingleProductByIdController;
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
const deleteProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield productModel_1.default.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.deleteProductController = deleteProductController;
