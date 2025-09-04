"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- src/routes/auth.routes.ts ---
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
router.post('/register', multer_1.default.single('profilePic'), userController_1.registerController);
router.get('/verify-email', userController_1.verifyEmailController);
router.post('/login', userController_1.loginController);
// router.get("./logout", authorize, logoutController);
// router.put('/user-avatar', auth, upload.array('avatar'), userAvatarController)   // the name(avatar) should match the name in the frontend form and in database
// router.delete('/deleteImage', auth, removeImageFromCloudinary)
// router.put(':/id', authorize, updateUserDetails)
// router.post('/refresh-token', refreshTokenController);
// router.get('/admin-data', authorize(['admin']), (req, res) => {
//   res.json({ msg: 'Confidential Admin Info' });
// });
exports.default = router;
