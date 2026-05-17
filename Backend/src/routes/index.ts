import { Router } from 'express';
import authRoutes from './api';

const router = Router();

router.use('/api', authRoutes);

export default router;
