import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

// Search
router.get("/", notImplemented);

// Specific Therapist Actions
router.get("/:therapistId/dashboard", notImplemented);
router.get("/:therapistId", notImplemented); // Profile
router.get("/:therapistId/availability", notImplemented);
router.post("/:therapistId/credentials/submit", notImplemented);
router.post("/:therapistId/availability/resume", notImplemented);
router.put("/:therapistId/schedule", notImplemented);
router.post("/:therapistId/availability/activate", notImplemented);
router.post("/:therapistId/availability/pause", notImplemented);
router.post("/:therapistId/availability/override", notImplemented);

// Therapist Appointments Views
router.get("/appointments/:therapistId", notImplemented);
router.get("/appointments/:therapistId/today", notImplemented);
router.get("/appointments/:therapistId/crisis-alerts", notImplemented);
router.get("/appointments/:therapistId/week", notImplemented);
router.get("/appointments/:therapistId/next", notImplemented);

export default router;
