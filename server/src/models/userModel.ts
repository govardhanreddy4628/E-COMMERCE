import mongoose, { Document, Model } from "mongoose";   //or we can destructure it like this  -->  import { Schema } from 'mongoose';


interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: Number;
  refresh_token: string;
  verify_email: Boolean;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  status: string;
  otp: string;
  otpExpiresAt?: Date;
  access_token: string,
  refresh_token_expiresAt?: Date;
  avatar: string;
  last_login_date?: Date;
  address_details?: mongoose.Types.ObjectId[];
  shopping_cart?: mongoose.Types.ObjectId[];
  orderHistory?: mongoose.Types.ObjectId[];
}

interface IUserDocument extends IUser, Document {
    createdAt:Date;
    updatedAt:Date;
}


const userSchema = new mongoose.Schema<IUserDocument>({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "provide email"],
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,                         //insted type: Buffer, can also be used when want to Store the password as binary data.
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
  isVerified: {
    type: Boolean, 
    default: false 
  },
  access_token : {
    type: String,
    default: ""
  },
  refresh_token : {
    type: String,
    default: ""
  },
  last_login_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type : String,
    enum : ["Active", "Inactive", "Suspended"],
    default : "Active"
  },
  address_details : [
    {
      type: mongoose.Schema.ObjectId,
      ref: "address"
    }
  ],
  shopping_cart : [
    {
      type: mongoose.Schema.ObjectId,
      ref: "cart"
    }
  ],
  orderHistory : [
    {
      type : mongoose.Schema.ObjectId,
      ref : "order"
    }
  ],
  otp: {
    type: String, 
    default: null,
    select: false, 
  },
  otpExpiresAt: {
    type : Date,
    default : "",
    select: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
  refresh_token_expiresAt: Date,
},{timestamps: true});

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

const UserModel = mongoose.model<IUserDocument>("user", userSchema);
export default UserModel;

