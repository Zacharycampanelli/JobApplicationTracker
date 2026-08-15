import { Router } from "express";

import { updateUser, uploadAvatar, updateUserPreferences } from "../../controllers/userController";
import { protect } from "../../middleware/authMiddleware";
import { uploadAvatarMiddleware } from "../../middleware/uploadMiddleware";

const router = Router();

router.patch('/me', protect, updateUser);
router.patch('/me/avatar', protect, uploadAvatarMiddleware, uploadAvatar);
router.patch('/me/preferences', protect, updateUserPreferences);

export default router;