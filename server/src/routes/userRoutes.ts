// --- src/routes/auth.routes.ts ---
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { loginController, logoutController, getNewAccessToken, registerController, verifyEmailController, removeImgFromCloudinary, userAvatarController, forgotPasswordController, getCurrentUserController } from '../controllers/userController';
import  { uploadSingle } from '../middleware/multer'; 

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
	Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/register', uploadSingle, registerController);
router.post('/verify-email', verifyEmailController);
router.post('/login', loginController);
router.get('/logout', auth(), asyncHandler(logoutController));
router.get('/me', auth(), asyncHandler(getCurrentUserController))
router.get('/auth/refresh', auth(), asyncHandler(getNewAccessToken))
// router.put('/user-avatar', auth, upload.array('avatar'), userAvatarController)   // the name(avatar) should match the name in the frontend form and in database
router.delete('/deleteImage', auth(), asyncHandler(removeImgFromCloudinary))
// router.put(':/id', authorize, updateUserDetails)
// router.post('/refresh-token', refreshTokenController);


// router.post('forgot-password', forgotPasswordController);
// router.post('verify-forgot-password-otp', verifyForgotPasswordOtpController);
// router.post('reset-password', resetPasswordController);





// router.get('/admin-data', authorize(['admin']), (req, res) => {
//   res.json({ msg: 'Confidential Admin Info' });
// });

export default router;