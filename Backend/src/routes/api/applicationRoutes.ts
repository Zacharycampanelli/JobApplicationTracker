import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import { getAllApplications, createApplication, deleteApplication } from "../../controllers/applicationController";

const router = Router();

router.get("/", protect, getAllApplications);
router.post("/", protect, createApplication);
router.delete("/:id", protect, deleteApplication);

export default router;