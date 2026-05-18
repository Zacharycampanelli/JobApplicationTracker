import { Router } from "express";
import authRoutes from "./authRoutes";
import applicationRoutes from "./applicationRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
export default router;