import { Router } from 'express';
import { protect } from '../../middleware/authMiddleware';
import {
  getAllApplications,
  createApplication,
  deleteApplication,
  getSingleApplication,
  updateApplication,
} from '../../controllers/applicationController';

const router = Router();

router.get('/', protect, getAllApplications);
router.get('/:id', protect, getSingleApplication);
router.post('/', protect, createApplication);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

export default router;
