import { Router } from "express";

import activityRoutes from "./activityRoutes";
import applicationRoutes from "./applicationRoutes";
import authRoutes from "./authRoutes";
import publicProfileRoutes from "./publicProfileRoutes";
import resumeRoutes from "./resumeRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/resumes', resumeRoutes);
router.use('/users', userRoutes);
router.use('/public', publicProfileRoutes);
router.use('/activities', activityRoutes);

export default router;
