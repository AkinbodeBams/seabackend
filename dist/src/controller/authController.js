"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = require("../util/appError");
const helper_1 = require("./helper");
const store_1 = __importDefault(require("../envStore/store"));
const accountDao_1 = require("../Dao/accountDao");
const prisma = new client_1.PrismaClient();
console.log(store_1.default);
// JWT Configuration
const JWT_CONFIG = {
    accessTokenSecret: store_1.default.JWT_ACCESS_SECRET,
    refreshTokenSecret: store_1.default.JWT_REFRESH_SECRET,
    accessTokenExpiry: "5m", // 5 minutes
    refreshTokenExpiry: 7,
};
// Generate JWT Tokens
const generateTokens = (accountId) => {
    // Access Token
    const accessToken = jsonwebtoken_1.default.sign({
        accountId,
        type: "access",
    }, JWT_CONFIG.accessTokenSecret, { expiresIn: JWT_CONFIG.accessTokenExpiry });
    // Refresh Token
    const refreshToken = jsonwebtoken_1.default.sign({
        accountId,
        type: "refresh",
        tokenId: (0, uuid_1.v4)(),
    }, JWT_CONFIG.refreshTokenSecret, { expiresIn: JWT_CONFIG.refreshTokenExpiry });
    // Calculate expiry timestamps
    const accessTokenDecoded = jsonwebtoken_1.default.decode(accessToken);
    const refreshTokenDecoded = jsonwebtoken_1.default.decode(refreshToken);
    return {
        accessToken,
        refreshToken,
        accessTokenExpiry: accessTokenDecoded.exp,
        refreshTokenExpiry: refreshTokenDecoded.exp,
    };
};
// Create successful auth response
const createAuthResponse = (accountId, sessionId, tokens, accountStatus, message) => {
    return {
        accountId,
        sessionId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: "Bearer",
        expiresIn: 300, // 5 minutes in seconds
        refreshTokenExpiresIn: 604800, // 7 days in seconds
        accountStatus: accountStatus,
        message,
    };
};
// Create session in database
const createSession = (accountId, refreshToken, deviceInfo, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = (0, uuid_1.v4)();
    yield prisma.session.create({
        data: {
            id: sessionId,
            accountId,
            refreshToken,
            deviceInfo: deviceInfo,
            ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isActive: true,
        },
    });
    return sessionId;
});
const deviceInfo = {
    deviceId: "dsdsdsd",
    osVersion: "2",
    deviceType: "WEB",
};
// Sign Up Controller
const signUp = (0, helper_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber, preferredLanguage = "en", acceptedTermsVersion, acceptedPrivacyVersion, registrationSource = "B2C_DIRECT", zoneId, } = req.body;
    // Check if account already exists
    const existingAccount = yield prisma.account.findUnique({
        where: { email },
    });
    if (existingAccount) {
        return next(new appError_1.AppError("Account with this email already exists", 400));
    }
    // Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    console.log(hashedPassword);
    const dataPayload = {
        email,
        password: hashedPassword,
        type: "SEAFARER",
        firstName,
        lastName,
        phoneNumber: phoneNumber,
    };
    // Create account in transaction
    const result = yield (0, accountDao_1.createAccount)(dataPayload);
    // Generate tokens
    const tokens = generateTokens(result.id);
    const sessionId = yield createSession(result.id, tokens.refreshToken, deviceInfo, req.ip);
    // Create response
    const response = createAuthResponse(result.id, sessionId || (0, uuid_1.v4)(), tokens, "ACTIVE", "Sign up successful");
    res.status(201).json(response);
}));
const login = (0, helper_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, // This is the email
    password, deviceInfo, clientId, ipAddress = req.ip, zoneId, } = req.body;
    // Validate input
    if (!username || !password) {
        return next(new appError_1.AppError("Please provide username and password", 400));
    }
    const account = yield (0, accountDao_1.findAccountByEmail)(username);
    // Check if account exists
    if (!account) {
        return next(new appError_1.AppError("Invalid credentials", 401));
    }
    // Verify password
    const isPasswordValid = yield bcryptjs_1.default.compare(password, account.password);
    if (!isPasswordValid) {
        return next(new appError_1.AppError("Invalid credentials", 401));
    }
    // Generate tokens
    const tokens = generateTokens(account.id);
    // Create or update session
    let sessionId;
    if (deviceInfo) {
        // Check for existing session with this device
        const existingSession = yield prisma.session.findFirst({
            where: {
                accountId: account.id,
                deviceInfo: {
                    path: ["deviceId"],
                    equals: deviceInfo.deviceId,
                },
                isActive: true,
            },
        });
        if (existingSession) {
            // Update existing session
            yield prisma.session.update({
                where: { id: existingSession.id },
                data: {
                    refreshToken: tokens.refreshToken,
                    ipAddress,
                    lastActivityAt: new Date(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
            sessionId = existingSession.id;
        }
        else {
            // Create new session
            sessionId = yield createSession(account.id, tokens.refreshToken, deviceInfo, ipAddress);
        }
    }
    else {
        sessionId = (0, uuid_1.v4)(); // Generate a session ID even without device info
    }
    // Create response matching the WhatsApp image format
    const response = {
        accountId: account.id,
        sessionId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: "Bearer",
        expiresIn: 300, // 5 minutes in seconds
        refreshTokenExpiresIn: 604800, // 7 days in seconds
        accountStatus: "ACTIVE",
        message: "Login successful",
    };
    res.status(200).json(response);
}));
exports.logout = (0, helper_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId, refreshToken, clientId, zoneId } = req.body;
    if (sessionId) {
        // Invalidate specific session
        yield prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false, loggedOutAt: new Date() },
        });
    }
    else if (refreshToken) {
        // Invalidate by refresh token
        yield prisma.session.updateMany({
            where: { refreshToken, isActive: true },
            data: { isActive: false, loggedOutAt: new Date() },
        });
    }
    res.status(200).json({
        message: "Logout successful",
    });
}));
exports.refreshToken = (0, helper_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, clientId, zoneId } = req.body;
    if (!refreshToken) {
        return next(new appError_1.AppError("Refresh token is required", 400));
    }
    // Verify refresh token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_CONFIG.refreshTokenSecret);
    }
    catch (error) {
        return next(new appError_1.AppError("Invalid or expired refresh token", 401));
    }
    // Check if token is a refresh token
    if (decoded.type !== "refresh") {
        return next(new appError_1.AppError("Invalid token type", 401));
    }
    // Check session in database
    const session = yield prisma.session.findFirst({
        where: {
            refreshToken,
            isActive: true,
            expiresAt: { gt: new Date() },
        },
        include: {
            account: true,
        },
    });
    if (!session) {
        return next(new appError_1.AppError("Session not found or expired", 401));
    }
    // Check account status
    if (!session.account.isActive) {
        return next(new appError_1.AppError("Account is not active", 403));
    }
    // Generate new tokens
    const tokens = generateTokens(session.accountId);
    // Update session with new refresh token
    yield prisma.session.update({
        where: { id: session.id },
        data: {
            refreshToken: tokens.refreshToken,
            lastActivityAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    // Create response
    const response = {
        accountId: session.accountId,
        sessionId: session.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: "Bearer",
        expiresIn: 300,
        refreshTokenExpiresIn: 604800,
        accountStatus: "ACTIVE",
        message: "Token refreshed successfully",
    };
    res.status(200).json(response);
}));
exports.default = { signUp, login };
