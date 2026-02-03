import { Router, type Request, type Response } from "express";
import authController from "../controller/authController";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.post("/register/therapist", authController.signUp);
router.post("/register/seafarer", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", notImplemented);

export default router;
