import { Router } from "express";

import { getUserRecentActivities } from "../../controllers/activityController";
import { protect } from "../../middleware/authMiddleware";

const router = Router();

router.get('/recent', protect, getUserRecentActivities);

export default router;