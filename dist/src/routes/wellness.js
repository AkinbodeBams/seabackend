"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const notImplemented = (req, res) => res.status(501).json({ message: "Not implemented" });
// Journals
router.post("/journals", notImplemented);
router.post("/journals/:journalId/pause", notImplemented);
router.post("/journals/:journalId/resume", notImplemented);
router.post("/journals/:journalId/sharing", notImplemented);
router.delete("/journals/:journalId/sharing/:therapistId", notImplemented);
// Check-ins
router.post("/checkins", notImplemented);
router.put("/checkins/:checkInId/mood", notImplemented);
router.put("/checkins/:checkInId/notes", notImplemented);
router.post("/checkins/:checkInId/submit", notImplemented);
router.get("/checkins/:checkInId", notImplemented);
router.get("/checkins/by-date/:seafarerId/:date", notImplemented);
router.get("/checkins/journal/:journalId", notImplemented);
// Trends & Calendar
router.get("/trends/:seafarerId", notImplemented);
router.get("/trends/:seafarerId/summary", notImplemented);
router.get("/trends/:seafarerId/stream", notImplemented);
router.get("/calendar/:seafarerId/:year/:month", notImplemented);
router.get("/calendar/:seafarerId/current", notImplemented);
router.get("/calendar/:seafarerId/range", notImplemented);
router.get("/calendar/:seafarerId/summary", notImplemented);
// Therapist Views
router.get("/therapist/:therapistId/patients", notImplemented);
router.get("/therapist/:therapistId/patients/:seafarerId", notImplemented);
router.get("/therapist/:therapistId/patients/:seafarerId/pre-session", notImplemented);
router.get("/therapist/:therapistId/patients/:seafarerId/stream", notImplemented);
router.get("/therapist/:therapistId/at-risk", notImplemented);
exports.default = router;
