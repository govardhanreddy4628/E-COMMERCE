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
exports.updateUserProfilePic = exports.removeImgFromCloudinary = exports.logoutController = exports.userAvatarController = exports.forgotPasswordController = exports.refreshTokenController = exports.loginController = exports.verifyEmailController = exports.registerController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const ApiError_1 = require("../utils/ApiError");
const generateToken_1 = require("../utils/generateToken");
const ApiResponse_1 = require("../utils/ApiResponse");
const sendEmail_1 = require("../utils/sendEmail");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const validator_1 = __importDefault(require("validator"));
// registration
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password, fullName, confirmPassword } = req.body;
        const profilePicUrl = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || undefined; // Assuming you're using multer for file uploads
        if (!email) {
            return res
                .status(400)
                .send({ message: "Email is Required", error: true, success: false }); //though it works. still better to use json instead of send
        }
        if (!validator_1.default.isEmail(email)) {
            throw new Error("Invalid email format");
        }
        if (!password) {
            return res
                .status(404)
                .json(new ApiResponse_1.ApiResponse(400, "Password is Required", null));
        }
        // if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
        //   throw new Error(
        //     "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols"
        //   );
        // }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        //add validations for remaining fields
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser && existingUser.isVerified)
            throw new ApiError_1.ApiError(400, "User already exists");
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const user = new userModel_1.default({
            fullName,
            email,
            password: hashedPassword,
            otp: verificationToken,
            otpExpires: Date.now() + 600000,
            profilePic: profilePicUrl, // Save the profile picture URL if provided
        });
        yield user.save();
        yield (0, sendEmail_1.sendVerificationEmail)(email, verificationToken);
        res.json({ msg: "Check your email to verify." });
    }
    catch (err) {
        next(err);
    }
});
exports.registerController = registerController;
//verify email
const verifyEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oneTimeVerificationPassword = req.query.token;
        const user = yield userModel_1.default.findOne({
            otp: oneTimeVerificationPassword,
            otpExpires: { $gt: Date.now() },
        });
        if (!user)
            throw new ApiError_1.ApiError(400, "Invalid verification token or expired verification code");
        user.isVerified = true;
        user.otp = "";
        user.otpExpires = undefined;
        yield user.save();
        res.json({ msg: "Email verified successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.verifyEmailController = verifyEmailController;
// login
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password!",
            });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            throw new ApiError_1.ApiError(400, "Invalid credentials", [
                "user does not exist with this email or password",
            ]);
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (!match)
            throw new ApiError_1.ApiError(400, "Invalid credentials");
        if (!user.isVerified)
            throw new ApiError_1.ApiError(403, "Email not verified");
        const accessToken = (0, generateToken_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, generateToken_1.generateRefreshToken)(user.id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, //in production secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.loginController = loginController;
const refreshTokenController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            throw new ApiError_1.ApiError(401, "No refresh token");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        const accessToken = (0, generateToken_1.generateAccessToken)(user.id, user.role);
        res.json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshTokenController = refreshTokenController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is required" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New Password is required" });
        }
        const user = yield userModel_1.default.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
        yield userModel_1.default.findByIdAndUpdate(user._id, { password: hashed });
        return res.status(200).send({
            success: true,
            message: "Password Reset Successful",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something Went Wrong",
            error,
        });
    }
});
exports.forgotPasswordController = forgotPasswordController;
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
//method1 :
//     var imagesArr = [];
//     for (let i = 0; i < files?.length; i++) {
//       const img = await cloudinary.uploader.upload(
//         files[i].path,
//         options,
//         function (error, result) {
//           imagesArr.push(result.secure_url);
//           fstat.unlinkSync(`uploads/${req.files[i].filename}`);
//         }
//       );
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error });
//   }
// }
//method2 :
const userAvatarController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user; // Ensure this comes from your auth middleware
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        // Validate userId
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ message: "Invalid user ID" });
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
            resource_type: "image",
            format: "jpg",
            public_id: `user_${userId}`,
            use_filename: true,
            unique_filename: false,
            overwrite: true, // Set to true if you want to replace existing avatar
            secure: true,
        };
        const uploadPromises = files.map((file) => cloudinary_1.default.uploader.upload(file.path, options));
        const uploadResults = yield Promise.all(uploadPromises);
        // Cleanup local files
        const deletePromises = files.map((file) => fs_1.default.promises.unlink(file.path).catch((err) => console.error(`Error deleting file ${file.path}:`, err)));
        yield Promise.all(deletePromises);
        const imageUrls = uploadResults.map((result) => result.secure_url);
        return res.status(200).json({
            message: "Images uploaded successfully",
            images: imageUrls,
        });
    }
    catch (error) {
        console.error("Upload failed:", error);
        return res.status(500).json({ message: "Upload failed", error: error.message });
    }
});
exports.userAvatarController = userAvatarController;
const logoutController = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.sendStatus(204);
};
exports.logoutController = logoutController;
// export const removeImgFromCloudinary = async(req: Request, res: Response) => {
//   const imgUrl = req.query.img;
//   const urlArr = imgUrl.split("/");
//   const image = urlArr[urlArr.length - 1];
//   const imageName = image.split(".")[0];
//   if(imageName){
//     const res = await cloudinary.uploader.destroy(
//       imageName, (error, result) => {
//       }
//     );
//     if(res){
//       res.status(200).send(res)
//     }
//   }
// }
const removeImgFromCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imgUrl = req.query.img;
        if (!imgUrl) {
            return res.status(400).json({ error: "Image URL is required." });
        }
        const urlSegments = imgUrl.split("/");
        const imageWithExtension = urlSegments[urlSegments.length - 1];
        const publicId = imageWithExtension.split(".")[0]; // Assumes image name doesn't include extra dots
        // Optional: if your images are in a folder like 'profile_pics/abc123', preserve the full path
        const folderSegments = urlSegments.slice(urlSegments.indexOf("upload") + 1);
        const fullPublicId = folderSegments.join("/").split(".")[0];
        const result = yield cloudinary_1.default.uploader.destroy(fullPublicId);
        if (result.result === "ok") {
            return res.status(200).json({ success: true, message: "Image deleted successfully." });
        }
        else {
            return res.status(404).json({ error: "Image not found or already deleted." });
        }
    }
    catch (error) {
        console.error("Cloudinary delete error:", error);
        return res.status(500).json({ error: "Failed to delete image from Cloudinary." });
    }
});
exports.removeImgFromCloudinary = removeImgFromCloudinary;
// PUT /api/user/profile-pic
const updateUserProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user; // Assuming you have auth middleware that adds user to req
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        // Upload to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: 'profile_pics',
        });
        // Update user in DB
        yield userModel_1.default.findByIdAndUpdate(userId, { profilePic: result.secure_url });
        res.json({ success: true, message: 'Profile picture updated', imageUrl: result.secure_url });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
});
exports.updateUserProfilePic = updateUserProfilePic;
