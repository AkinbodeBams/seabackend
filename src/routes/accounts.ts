import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.get("/:accountId/lookup", notImplemented);
router.get("/lookup/by-email", notImplemented);
router.get("/lookup/email/:email", notImplemented);

export default router;
