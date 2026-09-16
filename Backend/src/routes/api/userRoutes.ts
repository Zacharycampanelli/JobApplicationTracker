import { Router } from "express";

import { updateUser, uploadAvatar, updateUserPreferences } from "../../controllers/userController";
import { protect } from "../../middleware/authMiddleware";
import { uploadAvatarMiddleware } from "../../middleware/uploadMiddleware";
import { validateBody } from "../../middleware/validateRequest";
import { updateProfileSchema, updatePreferencesSchema } from "../../schemas/userSchemas";

const router = Router();

router.patch("/me", protect, validateBody(updateProfileSchema), updateUser);
router.patch("/me/avatar", protect, uploadAvatarMiddleware, uploadAvatar);
router.patch("/me/preferences", protect, validateBody(updatePreferencesSchema), updateUserPreferences);

export default router;
