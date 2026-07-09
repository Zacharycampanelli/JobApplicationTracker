import { Router } from 'express';
import applicationRoutes from './applicationRoutes';
import authRoutes from './authRoutes';
import resumeRoutes from './resumeRoutes';
import userRoutes from './userRoutes';
import publicProfileRoutes from './publicProfileRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/resumes', resumeRoutes);
router.use('/users', userRoutes);
router.use('/public', publicProfileRoutes);

export default router;
