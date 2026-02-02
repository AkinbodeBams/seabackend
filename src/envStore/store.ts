import "dotenv/config";
import { AuthEnvStore } from "./types";

export const authEnvStore: AuthEnvStore = {
  JWT_ACCESS_SECRET: "",
  JWT_REFRESH_SECRET: "",
  JWT_ACCESS_EXPIRY: "",
  JWT_REFRESH_EXPIRY: "",
  expiresIn: 0,
  SESSION_EXPIRY_DAYS: 0,
};

const typedKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as Array<keyof T>;

export const configureAuthEnv = (): void => {
  typedKeys(authEnvStore).forEach((envVar) => {
    const value = process.env[envVar];

    if (value === undefined) return;

    if (envVar === "expiresIn" || envVar === "SESSION_EXPIRY_DAYS") {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        throw new Error(`${envVar} must be a number`);
      }
      authEnvStore[envVar] = parsed as any;
    } else {
      authEnvStore[envVar] = value as any;
    }
  });

  const missing = typedKeys(authEnvStore).filter((key) =>
    typeof authEnvStore[key] === "string"
      ? authEnvStore[key] === ""
      : authEnvStore[key] === 0,
  );

  if (missing.length) {
    console.error("❌ Missing env vars:", missing.join(", "));
    process.exit(1);
  }
};

// 🔥 initialize immediately
configureAuthEnv();

export default authEnvStore;
