export interface AuthEnvStore {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  expiresIn: number;
  SESSION_EXPIRY_DAYS: number;
}
