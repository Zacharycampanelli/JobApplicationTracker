import { Router } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { getUserRecentActivities } from '../../controllers/activityController';

const router = Router();

router.get('/recent', protect, getUserRecentActivities);

export default router;