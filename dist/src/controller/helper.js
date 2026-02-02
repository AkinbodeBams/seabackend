"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSentToken = exports.catchAsync = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../util/appError");
const store_1 = __importDefault(require("../envStore/store"));
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new appError_1.AppError("JWT secret is not configured", 500);
    }
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: store_1.default.expiresIn,
    });
};
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
// Create and send token response
const createSentToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "30") *
                24 *
                60 *
                60 *
                1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };
    // Remove sensitive data from user object
    const sanitizedUser = Object.assign({}, user);
    sanitizedUser.password = undefined;
    sanitizedUser.passwordConfirm = undefined;
    res.cookie("jwt", token, cookieOptions);
    res.cookie("UserId", user.id, Object.assign(Object.assign({}, cookieOptions), { httpOnly: false }));
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: sanitizedUser,
        },
    });
};
exports.createSentToken = createSentToken;
