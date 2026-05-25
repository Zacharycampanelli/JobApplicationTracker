import { deleteResume, getResumes, uploadResume } from '../../controllers/resumeController';

import { Router } from 'express';
import { handleResumeUpload } from '../../middleware/uploadMiddleware';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.post('/upload', protect, handleResumeUpload, uploadResume);
router.get('/', protect, getResumes);
router.delete('/:id', protect, deleteResume);

export default router;
