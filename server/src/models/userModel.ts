import mongoose from "mongoose"; //or we can destructure it like this  -->  import { Schema, model } from 'mongoose';
import IUser from "../types/modelTypes.ts/userTypes";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "provide name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "provide password"],
  },
  contact: {
    type: Number,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: { type: String, default: "" },
});

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

const userModel = mongoose.model<IUser>("user", userSchema);
export default userModel;

// const userSchema = new Schema({

//   password: { type: Buffer, required: true },

//   addresses: { type: [Schema.Types.Mixed] },
//   // for addresses, we can make a separate Schema like orders. but in this case we are fine.
//   salt: Buffer,

// },{timestamps: true});

// import mongoose, { Document, Model } from "mongoose";

// export interface IUser {
//     fullname:string;

//     address:string;
//     city:string;
//     country:string;

//     admin:boolean;

//     isVerified?: boolean;
//     resetPasswordToken?:string;
//     resetPasswordTokenExpiresAt?:Date;
//     verificationToken?:string;
//     verificationTokenExpiresAt?:Date
// }

// export interface IUserDocument extends IUser, Document {
//     createdAt:Date;
//     updatedAt:Date;
// }

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
//     // advanced authentication

//     resetPasswordTokenExpiresAt:Date,

//     verificationTokenExpiresAt:Date,
// },{timestamps:true});

// export const User : Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);
