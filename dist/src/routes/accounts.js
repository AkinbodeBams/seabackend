"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const notImplemented = (req, res) => res.status(501).json({ message: "Not implemented" });
router.get("/:accountId/lookup", notImplemented);
router.get("/lookup/by-email", notImplemented);
router.get("/lookup/email/:email", notImplemented);
exports.default = router;
