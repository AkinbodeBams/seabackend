// controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  AuthResponse,
  DeviceInfo,
  LoginRequest,
  SignUpRequest,
} from "../../types/auth";
import { AppError } from "../util/appError";
import { catchAsync } from "./helper";
import envStore from "../envStore/store";
import { createAccount } from "../Dao/accountDao";
import { signUpdataPayload } from "../../types";

const prisma = new PrismaClient();
console.log(envStore);

// JWT Configuration
const JWT_CONFIG = {
  accessTokenSecret: envStore.JWT_ACCESS_SECRET,
  refreshTokenSecret: envStore.JWT_REFRESH_SECRET,
  accessTokenExpiry: "5m", // 5 minutes
  refreshTokenExpiry: 7,
};

console.log(JWT_CONFIG);

// Generate JWT Tokens
const generateTokens = (
  accountId: string,
): {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
} => {
  // Access Token
  const accessToken = jwt.sign(
    {
      accountId,

      type: "access",
    },
    JWT_CONFIG.accessTokenSecret,
    { expiresIn: JWT_CONFIG.accessTokenExpiry as unknown as number },
  );

  // Refresh Token
  const refreshToken = jwt.sign(
    {
      accountId,

      type: "refresh",
      tokenId: uuidv4(),
    },
    JWT_CONFIG.refreshTokenSecret,
    { expiresIn: JWT_CONFIG.refreshTokenExpiry },
  );

  // Calculate expiry timestamps
  const accessTokenDecoded = jwt.decode(accessToken) as any;
  const refreshTokenDecoded = jwt.decode(refreshToken) as any;

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: accessTokenDecoded.exp,
    refreshTokenExpiry: refreshTokenDecoded.exp,
  };
};

// Create successful auth response
const createAuthResponse = (
  accountId: string,
  sessionId: string,
  tokens: ReturnType<typeof generateTokens>,
  accountStatus: string,
  message: string,
): AuthResponse => {
  return {
    accountId,
    sessionId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: "Bearer",
    expiresIn: 300, // 5 minutes in seconds
    refreshTokenExpiresIn: 604800, // 7 days in seconds
    accountStatus: accountStatus as "ACTIVE",
    message,
  };
};

// Create session in database
const createSession = async (
  accountId: string,
  refreshToken: string,
  deviceInfo: DeviceInfo,
  ipAddress?: string,
): Promise<string> => {
  const sessionId = uuidv4();

  await prisma.session.create({
    data: {
      id: sessionId,
      accountId,
      refreshToken,
      deviceInfo: deviceInfo as any,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isActive: true,
    },
  });

  return sessionId;
};

const deviceInfo: DeviceInfo = {
  deviceId: "dsdsdsd",
  osVersion: "2",
  deviceType: "WEB",
};
// Sign Up Controller
const signUp = catchAsync(
  async (
    req: Request<{}, {}, SignUpRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      preferredLanguage = "en",
      acceptedTermsVersion,
      acceptedPrivacyVersion,
      registrationSource = "B2C_DIRECT",
      zoneId,
    } = req.body as SignUpRequest;

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return next(new AppError("Account with this email already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);

    const dataPayload: signUpdataPayload = {
      email,
      password: hashedPassword,
      type: "SEAFARER",
      firstName,
      lastName,
      phoneNumber: phoneNumber,
    };

    // Create account in transaction
    const result = await createAccount(dataPayload);

    // Generate tokens
    const tokens = generateTokens(result.id);

    const sessionId = await createSession(
      result.id,
      tokens.refreshToken,
      deviceInfo,
      req.ip,
    );

    // Create response
    const response: AuthResponse = createAuthResponse(
      result.id,
      sessionId || uuidv4(),
      tokens,
      "ACTIVE",
      "Sign up successful",
    );

    res.status(201).json(response);
  },
);

export default { signUp };
