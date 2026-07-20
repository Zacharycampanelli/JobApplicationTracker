import { Router } from 'express';
import { protect } from '../../middleware/authMiddleware';
import {
  getAllApplications,
  createApplication,
  deleteApplication,
  getSingleApplication,
  updateApplication,
  getRecentApplications,
  updateApplicationStatus,
} from '../../controllers/applicationController';

const router = Router();

router.get('/recent', protect, getRecentApplications);
router.get('/:id', protect, getSingleApplication);
router.get('/', protect, getAllApplications);
router.post('/', protect, createApplication);
router.put('/:id', protect, updateApplication);
router.patch('/:id/status', protect, updateApplicationStatus)
router.delete('/:id', protect, deleteApplication);

export default router;
