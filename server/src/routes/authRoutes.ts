// --- src/routes/auth.routes.ts ---
import { Router } from 'express';
import { authorize } from '../middleware/auth';
import { loginController, logoutController, refreshTokenController, registerController, userAvatarController, verifyEmailController } from '../controllers/authController';

const router = Router();

router.post('/register', registerController);

router.get('/verify-email', verifyEmailController);

router.post('/login', loginController);

router.get("./logout", authorize, logoutController);

router.put('/user-avatar', authorize, userAvatarController)

router.post('/refresh-token', refreshTokenController);

router.get('/admin-data', authorize(['admin']), (req, res) => {
  res.json({ msg: 'Confidential Admin Info' });
});

export default router;