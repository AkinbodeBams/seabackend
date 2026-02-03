"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controller/authController"));
const router = (0, express_1.Router)();
const notImplemented = (req, res) => res.status(501).json({ message: "Not implemented" });
router.post("/register/therapist", authController_1.default.signUp);
router.post("/register/seafarer", authController_1.default.signUp);
router.post("/login", authController_1.default.login);
router.post("/logout", notImplemented);
exports.default = router;
