"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const notImplemented = (req, res) => res.status(501).json({ message: "Not implemented" });
router.get("/appointments/:seafarerId", notImplemented);
router.get("/appointments/:seafarerId/upcoming", notImplemented);
router.get("/appointments/:seafarerId/pending-rating", notImplemented);
exports.default = router;
