// TODO : initiate background job to delete unverified users after 24 hours of registration.     initiate background job to send successful registration email. initiate background job to notify customer to verify email if not verified within 24 hours of registration.
import bcrypt from "bcryptjs";
import crypto, { verify } from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import {
  ACCESS_EXPIRES_SEC,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_EXPIRES_SEC,
} from "../utils/generateToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import validator from "validator";
import redisClient from "../config/connectRedis.js";
import { storeSession } from "../utils/redisSessions.js";
import logger from "../utils/logger.js";
import { hashToken } from "../utils/hash.js";

// helper cookie opts
const cookieOptionsBase: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict",
  path: "/",
};

// ===================== registration =======================
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { email, password, fullName, confirmPassword } = req.body;
    const avatar = req.file?.path || undefined; // Assuming you're using multer for file uploads
    console.log(avatar);

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Password is Required", null)); //Ensure status codes align with typical conventions (400 for bad requests, avoid using 404 for validation errors).
    }
    // if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
    //   throw new Error(
    //     "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols"
    //   );
    // }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    //add validations for remaining fields

    const existingUser = await UserModel.findOne({ email }).select(
      "+otp +otpExpiresAt"
    );

    //const verificationToken = crypto.randomBytes(32).toString("hex");
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiryMs = 10 * 60 * 1000;   // 10 minutes

    if (existingUser) {
      if (existingUser.isVerified) {
        // Case 1: User exists and is verified → block registration
        throw new ApiError(400, "User already exists");
      } else {
        // Case 2: User exists but is NOT verified → resend verification email

        const lastSent = existingUser.otpExpiresAt;
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        // Simple throttle: disallow resend more than once per minute.
        if (lastSent && lastSent > oneMinuteAgo) {
          return res
            .status(429)
            .json({ message: "OTP recently sent. Try again in a minute." });
        }

        existingUser.otp = hashedOtp;
        existingUser.otpExpiresAt = new Date(Date.now() + otpExpiryMs);
        await existingUser.save();

        // intent token to bind OTP verification action (short lived)
        const intentToken = jwt.sign(
          { email: existingUser.email, userId: existingUser.id.toString() }, //actually here no need to use toString() method because mongoose.Document has a built-in getter for .id, and it returns a string by default. ✅ existingUser.id is already a string. ❌ existingUser._id is an ObjectId, and would need .toString()
          process.env.LOGIN_INTENT_SECRET!,
          { expiresIn: "15m" }
        );

        await sendVerificationEmail(existingUser.email, otp);

        return res.status(200).json({
          msg: "User already exists but is not verified. Verification email resent.",
          intentToken,
        });
      }
    }

    // Case 3: New user → create and send verification
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt: new Date(Date.now() + otpExpiryMs),
      avatar,
      isVerified: false,
    });

    const intentToken = jwt.sign(
      { email: newUser.email, userId: newUser.id.toString() },
      process.env.LOGIN_INTENT_SECRET!,
      { expiresIn: "15m" }
    );

    await sendVerificationEmail(newUser.email, otp);

    return res.status(201).json({
      msg: "New user created. Check your email to verify.",
      intentToken,
      success: true,
      error: false,
      isVerified: false,
    });
  } catch (err) {
    next(err);
  }
};

//=====================verify email=====================
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { otp, intentToken } = req.body;

    if (!otp || !intentToken) {
      throw new ApiError(400, " OTP and intent token are required");
    }

    const decoded = jwt.verify(
      intentToken,
      process.env.LOGIN_INTENT_SECRET!
    ) as { email: string; userId: string };

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await UserModel.findOne({
      email: decoded.email,
      otp: hashedOtp,
      otpExpiresAt: { $gt: Date.now() },
    }).select("+otp +otpExpiresAt +password");

    if (!user) throw new ApiError(400, "Invalid or expired OTP");

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // auto-login after verify: create tokens and session
    const accessToken = generateAccessToken(user.id, user.role);
    //const refreshToken = generateRefreshToken(user.id);
    const { token: refreshToken, sid } = generateRefreshToken(user.id);


        // store hashed refresh in redis & metadata
    await storeSession({ rawRefreshToken: refreshToken, userId: user.id, sid, meta: { ip: req.ip, ua: req.get("user-agent") } });


    // await UserModel.findByIdAndUpdate(user.id, {
    //   last_login_date: new Date(),
    // });


    res.cookie("accessToken", accessToken, {
      ...cookieOptionsBase,
      maxAge: ACCESS_EXPIRES_SEC * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptionsBase,
      maxAge: REFRESH_EXPIRES_SEC * 1000, // usually days
    });

    res.status(200).json({
      success: true,
      message: "Email verified and login successful",
      // data: {
      //   accessToken,
      //   refreshToken,
      // },
    });
  } catch (err) {
    next(err);
  }
};

// ==============================login=======================
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    const user = await UserModel.findOne({ email }).select(
      "+password +otp +otpExpiresAt"
    );

    if (!user) {
      throw new ApiError(400, "User Does not Exist.");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Contact admin - account is not active.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(400, "Invalid credentials.");
    }

    // case 1: If email not verified — resend OTP and return intent token
    if (!user.isVerified) {
      //const verificationToken = crypto.randomBytes(32).toString("hex");
      const otp = crypto.randomInt(100000, 999999).toString();
      const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

      user.otp = hashedOtp;

      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      await sendVerificationEmail(user.email, otp);

      const intentToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.LOGIN_INTENT_SECRET!,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        success: false,
        message: "Please verify your email with the OTP sent to your email.",
        intentToken: intentToken,
        needVerify: true 
      });
      return;
    }

    // case 2: Email verified, generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const { token: refreshToken, sid } = generateRefreshToken(user.id);

    // store refresh in redis for revocation & rotation
    await storeSession({ rawRefreshToken: refreshToken, userId: user.id, sid, meta: { ip: req.ip, ua: req.get("user-agent") } });

    await UserModel.findByIdAndUpdate(user.id, {
      last_login_date: new Date(),
    });


    // Access Token
    res.cookie("accessToken", accessToken, {
      ...cookieOptionsBase,
      maxAge: ACCESS_EXPIRES_SEC * 1000,  // 15 minutes
    });

    // Refresh Token
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptionsBase,
      maxAge: REFRESH_EXPIRES_SEC * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

//========================regenerate new accessToken and refreshToken==============
export const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const rawRefresh = (req.cookies?.refresh_token as string) || (req.cookies?.refreshToken as string);
    if (!rawRefresh) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // hash the incoming raw refresh token (must match how you stored it)
    const hashed = hashToken(rawRefresh);
    const redisKey = `refresh:${hashed}`;

    const storedJson = await redisClient.get(redisKey);
    if (!storedJson) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // if you stored JSON like { userId, sid }, parse it
    let stored: { userId: string; sid?: string } | string = storedJson;
    try {
      stored = JSON.parse(storedJson);
    } catch {
      // if older code stored plain string userId
      stored = storedJson;
    }

    // verify refresh JWT
    const decoded = jwt.verify(rawRefresh, process.env.JWT_REFRESH_SECRET!) as { id: string; sid?: string };

    const storedUserId = typeof stored === "string" ? stored : (stored as any).userId;
    if (decoded.id !== storedUserId) {
      return res.status(403).json({ message: "Token user mismatch" });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // rotate: delete old entry and create a new refresh token + store hashed mapping
    await redisClient.del(redisKey);

    const { token: newRefreshToken, sid: newSid } = generateRefreshToken(decoded.id);

    // store new refresh token (use your storeSession helper to ensure same format/hashing)
    await storeSession({
      rawRefreshToken: newRefreshToken,
      userId: decoded.id,
      sid: newSid,
      meta: { ip: req.ip, ua: req.get("user-agent") || "" },
    });

    // set new cookie names consistent with above
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      path: "/",
      maxAge: REFRESH_EXPIRES_SEC * 1000,
    });

    const newAccessToken = generateAccessToken(user.id, user.role);
    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error("getNewAccessToken error:", err);
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =====================currentUserController=========================
export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing user ID" });
    }

    const user = await UserModel.findById(userId).select(
      "-password -otp -otpExpiresAt -refresh_token"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};


// --- controllers/auth/logoutController.ts ---
const getUserSessionKey = (userId: string) => `user_sessions:${userId}`;
const getBlacklistKey = (token: string) => `bl_refresh:${token}`;

export const logoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    const refreshToken = req.cookies?.refreshToken;

    if (!userId || !refreshToken) {
      return res.status(401).json({
        message: "Unauthorized: Missing user or token",
        error: true,
        success: false,
      });
    }

    // Redis keys
    const sessionKey = getUserSessionKey(userId);
    const blacklistKey = getBlacklistKey(refreshToken);

    // Cookie options (must match login!)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV_MODE === "production",
      sameSite:
        process.env.NODE_ENV_MODE === "production"
          ? ("none" as "none")
          : ("strict" as "strict"),
      path: "/", // 🔑 important to match original cookie
    };

    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // Remove refresh token from user's active session list
    const removed = await redisClient.sRem(sessionKey, refreshToken);
    if (removed === 0) {
      logger.warn(
        `Logout: Refresh token not found in session set. User: ${userId}`
      );
    }

    // Blacklist refresh token to prevent reuse
    await redisClient.setEx(
      blacklistKey,
      7 * 24 * 60 * 60, // 7 days
      "blacklisted"
    );

    logger.info(`User ${userId} logged out. Refresh token invalidated.`);

    return res.status(200).json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (err: any) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: "Internal server error during logout",
      error: true,
      success: false,
    });
  }
};


//================forgot password======================
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required");

    const user = await UserModel.findOne({ email }).select(
      "+otp +otpExpiresAt"
    );

    // Always respond with success message to avoid email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, an OTP has been sent",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await sendVerificationEmail(user.email, otp); // Secure email utility

    return res.status(200).json({
      success: true,
      message: "If the email exists, an OTP has been sent",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) throw new ApiError(401, "Reset token missing");

    const { userId, email } = jwt.verify(
      token,
      process.env.LOGIN_INTENT_SECRET!
    ) as { userId: string; email: string };

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      throw new ApiError(400, "Both password fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const user = await UserModel.findById(userId).select(
      "+password +otp +otpExpiresAt"
    );

    if (!user || user.email !== email) {
      throw new ApiError(404, "User not found");
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = "";
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyForgotPasswordOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await UserModel.findOne({
      email,
      otp: hashedOtp,
      otpExpiresAt: { $gt: Date.now() },
    }).select("+otp +otpExpiresAt");

    if (!user) throw new ApiError(400, "Invalid or expired OTP");

    // Clear OTP
    user.otp = "";
    user.otpExpiresAt = undefined;
    await user.save();

    // Issue short-lived reset password token
    const intentToken = jwt.sign(
      { userId: user.id.toString(), email: user.email },
      process.env.LOGIN_INTENT_SECRET!,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified. Proceed to reset password.",
      intentToken,
    });
  } catch (err) {
    next(err);
  }
};




//=================upload images==================
export const userAvatarController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Ensure this comes from your auth middleware
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(500).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // first remove image from cloudinary
    const imgUrl = user.avatar;
    const urlArr = imgUrl.split("/");
    const avatar_image = urlArr[urlArr.length - 1];

    const imageName = avatar_image.split(".")[0];

    if (imageName) {
      const res = await cloudinary.uploader.destroy(
        imageName,
        (error, result) => {}
      );
    }

    // Validate file types
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    for (const file of files) {
      if (!validMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type" });
      }
    }

    const options = {
      folder: "avatar_uploads",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      resource_type: "image" as "image",
      format: "jpg",
      public_id: `user_${userId}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true, // Set to true if you want to replace existing avatar
      secure: true,
    };

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, options)
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Cleanup local files
    const deletePromises = files.map((file) =>
      fs.promises
        .unlink(file.path)
        .catch((err) => console.error(`Error deleting file ${file.path}:`, err))
    );
    await Promise.all(deletePromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    user.avatar = imageUrls[0];
    await user.save();

    return res.status(200).json({
      _id: userId,
      avatar: imageUrls[0],
      message: "Images uploaded successfully",
    });
  } catch (error: any) {
    console.error("Upload failed:", error);
    return res
      .status(500)
      .json({ message: "Upload failed", error: error.message });
  }
};


export const removeImgFromCloudinary = async (req: Request, res: Response) => {
  try {
    const imgUrl = req.query.img as string;

    if (!imgUrl) {
      return res.status(400).json({ error: "Image URL is required." });
    }

    const urlSegments = imgUrl.split("/");
    const imageWithExtension = urlSegments[urlSegments.length - 1];
    const publicId = imageWithExtension.split(".")[0]; // Assumes image name doesn't include extra dots

    // Optional: if your images are in a folder like 'profile_pics/abc123', preserve the full path
    const folderSegments = urlSegments.slice(urlSegments.indexOf("upload") + 1);
    const fullPublicId = folderSegments.join("/").split(".")[0];

    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result === "ok") {
      return res
        .status(200)
        .json({ success: true, message: "Image deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ error: "Image not found or already deleted." });
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete image from Cloudinary." });
  }
};

// PUT /api/user/profile-pic
export const updateUserProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Assuming you have auth middleware that adds user to req
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile_pics",
    });

    // Update user in DB
    await UserModel.findByIdAndUpdate(userId, {
      profilePic: result.secure_url,
    });

    res.json({
      success: true,
      message: "Profile picture updated",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

//===================update user===================
export async function updateUserDetails(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    const userExist = await UserModel.findById(userId);
    if (!userExist) return res.status(400).send("The user cannot be updated");

    let otp = "";
    if (email !== userExist.email) {
      otp = Math.floor(100000 * Math.random() * 900000).toString();
    }

    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    } else {
      hashedPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullName: name,
        mobile,
        email,
        verify_email: email ? false : true,
        password: hashedPassword,
        otp: otp !== "" ? otp : null,
        otpExpires: otp !== "" ? Date.now() + 600000 : "",
      },
      { new: true }
    );

    if (email !== userExist.email) {
      await sendVerificationEmail(userExist.email, otp);
    }

    return res.json({
      message: "user Updated successfully",
      error: false,
      success: true,
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: true,
      success: false,
    });
  }
}