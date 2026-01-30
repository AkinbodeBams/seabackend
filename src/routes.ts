import { Router } from "express";

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
