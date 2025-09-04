// --- src/routes/auth.routes.ts ---
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { loginController, logoutController, regenerateAccessTokenController, registerController, verifyEmailController, removeImgFromCloudinary, userAvatarController, forgotPasswordController, getCurrentUserController } from '../controllers/userController';
import upload from '../middleware/multer'; 

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
	Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/register', upload.single('avatar'), registerController);
router.post('/verify-email', verifyEmailController);
router.post('/login', loginController);
router.get('/logout', auth(), logoutController)
router.get('/current-user', auth(), asyncHandler(getCurrentUserController))
// router.put('/user-avatar', auth, upload.array('avatar'), userAvatarController)   // the name(avatar) should match the name in the frontend form and in database
// router.delete('/deleteImage', auth, removeImageFromCloudinary)
// router.put(':/id', authorize, updateUserDetails)
// router.post('/refresh-token', refreshTokenController);


// router.post('forgot-password', forgotPasswordController);
// router.post('verify-forgot-password-otp', verifyForgotPasswordOtpController);
// router.post('reset-password', resetPasswordController);




// router.get('/admin-data', authorize(['admin']), (req, res) => {
//   res.json({ msg: 'Confidential Admin Info' });
// });

export default router;