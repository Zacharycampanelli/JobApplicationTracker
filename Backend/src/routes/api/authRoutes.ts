import { Router } from "express";

import { forgotPassword, getMe, login, register, resetPassword } from "../../controllers/authController";
import { protect } from "../../middleware/authMiddleware";
import { authRateLimiter } from "../../middleware/rateLimitMiddleware";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.get("/me", protect, getMe);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);

export default router;
