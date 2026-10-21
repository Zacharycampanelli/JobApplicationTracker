import { Router } from "express";

import { deleteResume, downloadResume, getResumes, previewResume, uploadResume } from "../../controllers/resumeController";
import { protect } from "../../middleware/authMiddleware";
import { handleResumeUpload } from "../../middleware/uploadMiddleware";

const router = Router();

router.post("/upload", protect, handleResumeUpload, uploadResume);
router.get("/", protect, getResumes);
router.delete("/:id", protect, deleteResume);
router.get("/:id/preview", protect, previewResume);
router.get("/:id/download", protect, downloadResume);

export default router;
