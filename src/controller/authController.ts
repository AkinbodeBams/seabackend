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
import { createAccount, findAccountByEmail } from "../Dao/accountDao";
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

const login = catchAsync(
  async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      username, // This is the email
      password,
      deviceInfo,
      clientId,
      ipAddress = req.ip,
      zoneId,
    } = req.body;

    // Validate input
    if (!username || !password) {
      return next(new AppError("Please provide username and password", 400));
    }

    const account = await findAccountByEmail(username);

    // Check if account exists
    if (!account) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Generate tokens
    const tokens = generateTokens(account.id);

    // Create or update session
    let sessionId: string;
    if (deviceInfo) {
      // Check for existing session with this device
      const existingSession = await prisma.session.findFirst({
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
        await prisma.session.update({
          where: { id: existingSession.id },
          data: {
            refreshToken: tokens.refreshToken,
            ipAddress,
            lastActivityAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        sessionId = existingSession.id;
      } else {
        // Create new session
        sessionId = await createSession(
          account.id,
          tokens.refreshToken,
          deviceInfo,
          ipAddress,
        );
      }
    } else {
      sessionId = uuidv4(); // Generate a session ID even without device info
    }

    // Create response matching the WhatsApp image format
    const response: AuthResponse = {
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
  },
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId, refreshToken, clientId, zoneId } = req.body;

    if (sessionId) {
      // Invalidate specific session
      await prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false, loggedOutAt: new Date() },
      });
    } else if (refreshToken) {
      // Invalidate by refresh token
      await prisma.session.updateMany({
        where: { refreshToken, isActive: true },
        data: { isActive: false, loggedOutAt: new Date() },
      });
    }

    res.status(200).json({
      message: "Logout successful",
    });
  },
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken, clientId, zoneId } = req.body;

    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 400));
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_CONFIG.refreshTokenSecret) as any;
    } catch (error) {
      return next(new AppError("Invalid or expired refresh token", 401));
    }

    // Check if token is a refresh token
    if (decoded.type !== "refresh") {
      return next(new AppError("Invalid token type", 401));
    }

    // Check session in database
    const session = await prisma.session.findFirst({
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
      return next(new AppError("Session not found or expired", 401));
    }

    // Check account status
    if (!session.account.isActive || session.account.isSuspended) {
      return next(new AppError("Account is not active", 403));
    }

    // Generate new tokens
    const tokens = generateTokens(session.accountId, session.account.role);

    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Create response
    const response: AuthResponse = {
      accountId: session.accountId,
      sessionId: session.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: "Bearer",
      expiresIn: 300,
      refreshTokenExpiresIn: 604800,
      accountStatus: session.account.isSuspended ? "SUSPENDED" : "ACTIVE",
      message: "Token refreshed successfully",
    };

    res.status(200).json(response);
  },
);

export default { signUp, login };
