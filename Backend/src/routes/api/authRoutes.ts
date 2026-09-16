import { Router } from "express";

import { forgotPassword, getMe, login, register, resetPassword } from "../../controllers/authController";
import { protect } from "../../middleware/authMiddleware";
import { authRateLimiter } from "../../middleware/rateLimitMiddleware";
import { validateBody } from "../../middleware/validateRequest";
import { registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../../schemas/authSchemas";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registrationSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.get("/me", protect, getMe);
router.post("/forgot-password", authRateLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validateBody(resetPasswordSchema), resetPassword);

export default router;
