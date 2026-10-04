import { Router } from "express";

import apiRoutes from "./api";
import { csrfProtection } from "../middleware/csrfMiddleware";

const router = Router();

router.use("/api", csrfProtection, apiRoutes);

export default router;
