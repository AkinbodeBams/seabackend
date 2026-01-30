import { Router } from "express";
import authRoutes from "./auth";
import therapistRoutes from "./therapist";
import appointmentRoutes from "./appointments";
import adminRoutes from "./admin";
import wellnessRoutes from "./wellness";
import identityRoutes from "./identity";
import seafarerRoutes from "./seafarer";
import sessionRoutes from "./sessions";
import accountRoutes from "./accounts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/therapists", therapistRoutes);
router.use("/therapist", therapistRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/admin", adminRoutes);
router.use("/wellness", wellnessRoutes);
router.use("/identity", identityRoutes);
router.use("/seafarer", seafarerRoutes);
router.use("/sessions", sessionRoutes);
router.use("/accounts", accountRoutes);

export default router;
