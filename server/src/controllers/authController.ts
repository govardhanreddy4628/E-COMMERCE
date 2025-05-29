import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import {ApiError} from '../utils/ApiError';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { ApiResponse } from '../utils/ApiResponse';
import { Request, Response, NextFunction } from 'express';
import { sendVerificationEmail } from '../utils/sendEmail';
import fs from 'fs';
import cloudinary from '../config/cloudinary';


// registration
export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(404).json(new ApiResponse(400, "User already exists", null));
    }
    //add validations for remaining fields
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
    });
    await user.save();

    await sendVerificationEmail(email, verificationToken);
    res.json({ msg: "Check your email to verify." });
  } catch (err) {
    next(err);
  }
};



//verify email
export const verifyEmailController = async (req:Request, res:Response, next:NextFunction): Promise<void | any> => {
  try {
      const token = req.query.token;
      const user = await User.findOne({ verificationToken: token });
      if (!user) throw new ApiError(400, 'Invalid verification token');
      
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      
      res.json({ msg: 'Email verified successfully' });
    } catch (err) {
        next(err);
    }
}


// login
export const loginController = async (req:Request, res:Response, next:NextFunction): Promise<void | any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, 'Invalid credentials', ["user does not exist with this email or password"]);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(400, 'Invalid credentials');
    if (!user.isVerified) throw new ApiError(403, 'Email not verified');

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,     //in production secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}


export const refreshTokenController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, 'No refresh token');

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(404, 'User not found');

    const accessToken = generateAccessToken(user._id, user.role);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}


export const forgotPasswordController = async (req:Request, res:Response) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    
    const user = await User.findOne({ email, answer });
    
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);;
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};


// const tokenBlacklist = new Set<string>();
// const userTokens: Record<string, string> = {};

// export const refreshTokenWithTokenRotation = async (req, res) => {
//   const oldToken = req.cookies.refreshToken;
//   if (!oldToken || tokenBlacklist.has(oldToken)) {
//     return res.status(401).send('Invalid refresh token');
//   }

//   jwt.verify(oldToken, REFRESH_SECRET, (err, decoded: any) => {
//     if (err || userTokens[decoded.userId] !== oldToken) {
//       return res.status(403).send('Token reuse detected');
//     }

//     tokenBlacklist.add(oldToken); // Invalidate used token

//     const newToken = generateRefreshToken(decoded.userId);
//     userTokens[decoded.userId] = newToken;

//     res.cookie('refreshToken', newToken, { httpOnly: true, secure: true });
//     res.json({ accessToken: generateAccessToken(decoded.userId) });
//   });
// }


export async function userAvatarController(req:Request, res:Response){
  try {
    var imagesArr = [];

    const userId = req.userId;    //authorize middlewate  
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for(let i=0; i<files?.length; i++) {
      const img = await cloudinary.uploader.upload(
        files[i].path,
        options,
        function (error, result) {
          console.log(result)
          imagesArr.push(result.secure_url);
          fstat.unlinkSync(`uploads/${req.files[i].filename}`);
          console.log(req.files[i].filename)
        }
      )
    }
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
}



// model
// import mongoose, { Schema, Document } from "mongoose";

// export interface IImage extends Document {
//   url: string;
//   public_id: string;
// }

// const ImageSchema: Schema = new Schema({
//   url: { type: String, required: true },
//   public_id: { type: String, required: true },
// });

// export default mongoose.model<IImage>("Image", ImageSchema);



// import Image from "../models/Image";
// import { UploadedFile } from "express-fileupload";
// import fs from "fs";

// export const uploadImages = async (req: Request, res: Response) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const uploadPromises = files.map(async (file) => {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "mern_uploads",
//       });

//       // Optional: remove local file after upload
//       fs.unlinkSync(file.path);

//       const newImage = new Image({
//         url: result.secure_url,
//         public_id: result.public_id,
//       });

//       await newImage.save();

//       return newImage;
//     });

//     const uploadedImages = await Promise.all(uploadPromises);
//     res.status(201).json(uploadedImages);
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error });
//   }
// };



export const logoutController= (req: Request, res: Response) => {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.sendStatus(204);
};
