import { Router } from "express";

import { updateUser, uploadAvatar, updateUserPreferences, deleteAccount } from "../../controllers/userController";
import { protect } from "../../middleware/authMiddleware";
import { uploadAvatarMiddleware } from "../../middleware/uploadMiddleware";
import { validateBody } from "../../middleware/validateRequest";
import { updateProfileSchema, updatePreferencesSchema, deleteAccountSchema } from "../../schemas/userSchemas";

const router = Router();

router.patch("/me", protect, validateBody(updateProfileSchema), updateUser);
router.patch("/me/avatar", protect, uploadAvatarMiddleware, uploadAvatar);
router.patch("/me/preferences", protect, validateBody(updatePreferencesSchema), updateUserPreferences);
router.delete("/me", protect, validateBody(deleteAccountSchema), deleteAccount);
export default router;
