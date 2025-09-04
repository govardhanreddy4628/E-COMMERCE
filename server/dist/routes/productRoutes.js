"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.get("/getAllproduct", productController_1.getAllProductController);
router.get("/getSingleproduct/:id", productController_1.getSingleProductByIdController);
router.get("/createproduct", productController_1.createProductController);
// router.put("/updateproduct", updateProductController)
router.delete("/deleteproduct", productController_1.deleteProductController);
exports.default = router;
