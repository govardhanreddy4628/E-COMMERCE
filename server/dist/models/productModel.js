"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [1, "wrong min price"],
        max: [10000, "wrong max price"],
    },
    oldPrice: {
        type: Number,
        required: true,
        min: [1, "wrong min price"],
        max: [10000, "wrong max price"],
    },
    brand: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        min: [1, "wrong min discount"],
        max: [99, "wrong max discount"],
    },
    rating: {
        type: Number,
        min: [0, "wrong min rating"],
        max: [5, "wrong max rating"],
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    productRam: [
        {
            type: String,
            default: null
        }
    ],
    size: [
        {
            type: String,
            default: null
        }
    ],
    productWeight: [
        {
            type: String,
            default: null
        }
    ],
    productColor: [
        {
            type: String,
            default: null
        }
    ],
    discountPrice: {
        type: Number,
        default: function () {
            var _a;
            return Math.round(this.price * (1 - ((_a = this.discountPercentage) !== null && _a !== void 0 ? _a : 0) / 100));
        },
    },
    countInStock: {
        type: Number,
        min: [0, "wrong min stock"],
        default: 0
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    categoryName: {
        type: String,
        default: ""
    },
    categoryId: {
        type: String,
        default: "",
    },
    subCategoryName: {
        type: String,
        default: ""
    },
    subCategoryId: {
        type: String,
        default: "",
    },
    thirdSubCategoryName: {
        type: String,
        default: ""
    },
    thirdSubCategoryId: {
        type: String,
        default: "",
    },
    quantity: {
        type: Number,
        required: true,
    },
    // photo: {
    //     data: Buffer,
    //     contentType: String,
    // },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    sizes: {
        type: [mongoose_1.Schema.Types.Mixed]
    }, //Schema.Types.Mixed (or just mongoose.Schema.Types.Mixed) defines a Mongoose schema field that holds an array of arbitrary values — in other words, it's an array where each element can be any type (object, string, number, etc.).
    highlights: {
        type: [String]
    },
    shipping: {
        type: Boolean,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
const productModel = mongoose_1.default.model("Product", productSchema);
exports.default = productModel;
// const productSchema = new Schema({
//     title: { type : String, required: true, unique: true},
//     description: { type : String, required: true},
//     price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
//     discountPercentage: { type: Number, min:[1, 'wrong min discount'], max:[99, 'wrong max discount']},
//     rating: { type: Number, min:[0, 'wrong min rating'], max:[5, 'wrong max price'], default:0},
//     stock: { type: Number, min:[0, 'wrong min stock'], default:0},
//     brand: { type : String, required: true},
//     category: { type : String, required: true},
//     thumbnail: { type : String, required: true},
//     images:{ type : [String], required: true},
//     colors:{ type : [Schema.Types.Mixed] },
//     sizes:{ type : [Schema.Types.Mixed]},
//     highlights:{ type : [String] },
//     discountPrice: { type: Number},
//     deleted: { type : Boolean, default: false},
// })
