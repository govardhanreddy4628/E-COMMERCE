"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    images: [{
            type: String,
        }],
    parentCategoryName: {
        type: String,
    },
    parentCategoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    colour: {
        type: String,
    },
    slug: {
        type: String,
        lowercase: true,
    },
}, { timestamps: true });
const CategoryModel = mongoose_1.default.model("Category", categorySchema);
exports.default = CategoryModel;
