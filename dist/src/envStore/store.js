"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthEnv = exports.authEnvStore = void 0;
require("dotenv/config");
exports.authEnvStore = {
    JWT_ACCESS_SECRET: "",
    JWT_REFRESH_SECRET: "",
    JWT_ACCESS_EXPIRY: "",
    JWT_REFRESH_EXPIRY: "",
    expiresIn: 0,
    SESSION_EXPIRY_DAYS: 0,
};
const typedKeys = (obj) => Object.keys(obj);
const configureAuthEnv = () => {
    typedKeys(exports.authEnvStore).forEach((envVar) => {
        const value = process.env[envVar];
        if (value === undefined)
            return;
        if (envVar === "expiresIn" || envVar === "SESSION_EXPIRY_DAYS") {
            const parsed = Number(value);
            if (Number.isNaN(parsed)) {
                throw new Error(`${envVar} must be a number`);
            }
            exports.authEnvStore[envVar] = parsed;
        }
        else {
            exports.authEnvStore[envVar] = value;
        }
    });
    const missing = typedKeys(exports.authEnvStore).filter((key) => typeof exports.authEnvStore[key] === "string"
        ? exports.authEnvStore[key] === ""
        : exports.authEnvStore[key] === 0);
    if (missing.length) {
        console.error("❌ Missing env vars:", missing.join(", "));
        process.exit(1);
    }
};
exports.configureAuthEnv = configureAuthEnv;
// 🔥 initialize immediately
(0, exports.configureAuthEnv)();
exports.default = exports.authEnvStore;
