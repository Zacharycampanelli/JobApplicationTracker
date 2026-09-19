import { Router } from "express";

import { changePassword, forgotPassword, getMe, login, register, resetPassword } from "../../controllers/authController";
import { protect } from "../../middleware/authMiddleware";
import { authRateLimiter } from "../../middleware/rateLimitMiddleware";
import { validateBody } from "../../middleware/validateRequest";
import { registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../../schemas/authSchemas";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registrationSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.get("/me", protect, getMe);
router.post("/forgot-password", authRateLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validateBody(resetPasswordSchema), resetPassword);
router.patch("/change-password", protect, validateBody(changePasswordSchema), changePassword);

export default router;
