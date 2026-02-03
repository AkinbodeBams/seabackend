"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = __importDefault(require("../controller/accountController"));
const router = (0, express_1.Router)();
const notImplemented = (req, res) => res.status(501).json({ message: "Not implemented" });
router.get("/:accountId/lookup", notImplemented);
router.get("/lookup/by-email", notImplemented);
router.get("/lookup/email/:email", accountController_1.default.getAccount);
exports.default = router;
