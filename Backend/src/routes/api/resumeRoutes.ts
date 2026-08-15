import { Router } from "express";

import { deleteResume, getResumes, uploadResume } from "../../controllers/resumeController";
import { protect } from "../../middleware/authMiddleware";
import { handleResumeUpload } from "../../middleware/uploadMiddleware";

const router = Router();

router.post('/upload', protect, handleResumeUpload, uploadResume);
router.get('/', protect, getResumes);
router.delete('/:id', protect, deleteResume);

export default router;
