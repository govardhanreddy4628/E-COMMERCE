"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    fullName: {
        type: Number,
        required: true,
    },
    mobile: {
        type: Number,
        default: null,
        required: true,
    },
    houseNumber: {
        type: String,
        required: true,
    },
    address_line: {
        type: String,
        default: ""
    },
    landmark: {
        type: String,
    },
    pincode: {
        type: String, //the default value will be undefined when u didnot define default value explicitly.     
        required: true,
    },
    city: {
        type: String,
        default: "",
        required: true,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
        default: "",
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        default: ''
    },
}, { timestamps: true });
const addressModel = mongoose_1.default.model("address", addressSchema);
exports.default = addressModel;
