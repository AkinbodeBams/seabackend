import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.post("/reserve", notImplemented);
router.post("/:appointmentId/cancel", notImplemented);
router.post("/:appointmentId/confirm", notImplemented);
router.post("/:appointmentId/reschedule", notImplemented);

export default router;
