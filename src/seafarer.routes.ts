import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.get("/appointments/:seafarerId", notImplemented);
router.get("/appointments/:seafarerId/upcoming", notImplemented);
router.get("/appointments/:seafarerId/pending-rating", notImplemented);

export default router;
