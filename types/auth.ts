// types/auth.types.ts
export interface DeviceInfo {
  deviceId: string;
  deviceType: "IOS" | "ANDROID" | "WEB" | "DESKTOP";
  osVersion?: string;
  appVersion?: string;
  deviceFingerprint?: string;
}

export interface LoginRequest {
  username: string; // email
  password: string;
  deviceInfo: DeviceInfo;
  clientId?: string;
  ipAddress?: string;
  zoneId?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: {
    value: string;
    countryCode: string;
  };
  preferredLanguage?: string;
  acceptedTermsVersion: string;
  acceptedPrivacyVersion: string;
  registrationSource?: "B2C_DIRECT" | "COMPANY_PORTAL" | "REFERRAL";
  zoneId?: string;
}

export interface AuthResponse {
  accountId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
  accountStatus: "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE";
  message: string;
}

export interface AccountData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SEAFARER" | "THERAPIST" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE";
  preferredLanguage?: string;
  timezone?: string;
  createdAt: Date;
}
