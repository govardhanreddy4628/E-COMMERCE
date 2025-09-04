"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); //or we can destructure it like this  -->  import { Schema } from 'mongoose';
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "provide name"],
    },
    email: {
        type: String,
        required: [true, "provide email"],
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String, //insted type: Buffer, can also be used when want to Store the password as binary data.
        required: [true, "provide password"],
        select: false,
    },
    avatar: {
        type: String,
        default: "",
    },
    phoneNumber: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "cart"
        }
    ],
    orderHistory: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "order"
        }
    ],
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    refresh_token_expiresAt: Date,
}, { timestamps: true });
const virtual = userSchema.virtual("id");
virtual.get(function () {
    return this._id;
});
userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
const UserModel = mongoose_1.default.model("user", userSchema);
exports.default = UserModel;
// import mongoose, { Document, Model } from "mongoose";
// const userSchema = new mongoose.Schema<IUserDocument>({
//     fullname: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         default: "Update your address"
//     },
//     city:{
//         type:String,
//         default:"Update your city"
//     },
//     country:{
//         type:String,
//         default:"Update your country"
//     },
//     admin:{type:Boolean, default:false},
// },{timestamps:true});
// export const User : Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);
