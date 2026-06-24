import { Router } from 'express';
import { getAllUsers, updateUser, uploadAvatar } from '../../controllers/userController';
import { protect } from '../../middleware/authMiddleware';
import { uploadAvatarMiddleware } from '../../middleware/uploadMiddleware';

const router = Router();

router.get('/', protect, getAllUsers);
router.patch('/me', protect, updateUser)
router.patch('/me/avatar', protect, uploadAvatarMiddleware, uploadAvatar)

export default router;