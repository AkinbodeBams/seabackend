import { Router, type Request, type Response } from "express";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.post("/register/therapist", notImplemented);
router.post("/register/seafarer", notImplemented);
router.post("/login", notImplemented);
router.post("/logout", notImplemented);

export default router;
