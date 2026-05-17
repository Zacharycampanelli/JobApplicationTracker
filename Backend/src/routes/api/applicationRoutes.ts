import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import { getAllApplications } from "../../controllers/applicationController";

const router = Router();

router.get("/", protect, getAllApplications)
export default router;