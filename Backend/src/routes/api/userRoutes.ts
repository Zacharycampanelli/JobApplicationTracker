import { Router } from 'express';
import { getAllUsers, updateUser } from '../../controllers/userController';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAllUsers);
router.patch('/me', protect, updateUser)

export default router;