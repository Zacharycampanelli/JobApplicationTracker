import { Router } from "express";

import {
  getAllApplications,
  createApplication,
  deleteApplication,
  getSingleApplication,
  updateApplication,
  getRecentApplications,
  updateApplicationStatus,
} from "../../controllers/applicationController";
import { protect } from "../../middleware/authMiddleware";
import { validateBody } from "../../middleware/validateRequest";
import { applicationPayloadSchema, applicationStatusSchema } from "../../schemas/applicationSchemas";

const router = Router();

router.get("/recent", protect, getRecentApplications);
router.get("/:id", protect, getSingleApplication);
router.get("/", protect, getAllApplications);
router.post("/", protect, validateBody(applicationPayloadSchema), createApplication);
router.put("/:id", protect, validateBody(applicationPayloadSchema), updateApplication);
router.patch("/:id/status", protect, validateBody(applicationStatusSchema), updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);

export default router;
