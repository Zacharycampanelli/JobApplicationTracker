import { Router } from "express";
import applicationRoutes from "./applicationRoutes";
import authRoutes from "./authRoutes";
import resumeRoutes from "./resumeRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
router.use("/resumes", resumeRoutes);
router.use("/users", userRoutes);

export default router;