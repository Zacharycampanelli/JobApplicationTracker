import { Router } from "express";

import { csrfProtection } from "../middleware/csrfMiddleware";
import apiRoutes from "./api";

const router = Router();

router.use("/api", csrfProtection, apiRoutes);

export default router;
