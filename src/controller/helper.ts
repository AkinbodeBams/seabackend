import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { AppError } from "../util/appError";
import { CookieOptions, UserDocument } from "../../types";
import envStore from "../envStore/store";

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  return jwt.sign({ id }, secret, {
    expiresIn: envStore.expiresIn,
  });
};

export const catchAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
// Create and send token response
export const createSentToken = (
  user: UserDocument,
  statusCode: number,
  res: Response,
): void => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "30") *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Remove sensitive data from user object
  const sanitizedUser = { ...user };
  sanitizedUser.password = undefined as any;
  sanitizedUser.passwordConfirm = undefined;

  res.cookie("jwt", token, cookieOptions);
  res.cookie("UserId", user.id, {
    ...cookieOptions,
    httpOnly: false, // Allow client-side access
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: sanitizedUser,
    },
  });
};
