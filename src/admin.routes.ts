import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.post("/therapist/:therapistId/verification/reject", notImplemented);
router.get("/verifications", notImplemented);
router.get("/verifications/:therapistId", notImplemented);
router.post("/therapist/:therapistId/approve", notImplemented);

export default router;
