import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.post("/accounts/:accountId/suspend", notImplemented);
router.get("/profiles/:profileId", notImplemented);
router.get("/profiles/account/:accountId", notImplemented);
router.get("/profiles/email/:email", notImplemented);
router.get("/profiles/vessel/:vesselName", notImplemented);
router.get("/profiles/incomplete", notImplemented);
router.post("/profiles/:profileId/complete", notImplemented);
router.put("/profiles/:profileId/emergency-contacts", notImplemented);
router.post("/accounts/:accountId/request-deletion", notImplemented);

export default router;
