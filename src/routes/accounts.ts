import { Router, type Request, type Response } from "express";
import authController from "../controller/authController";
import accountController from "../controller/accountController";

const router = Router();
const notImplemented = (req: Request, res: Response) =>
  res.status(501).json({ message: "Not implemented" });

router.get("/:accountId/lookup", notImplemented);
router.get("/lookup/by-email", notImplemented);
router.get("/lookup/email/:email", accountController.getAccount);

export default router;
