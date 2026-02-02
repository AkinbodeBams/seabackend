"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 3000;
const { pid } = process;
app_1.default.set("port", port);
const server = http_1.default.createServer(app_1.default);
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection at:", reason);
    // Don't exit the process for unhandled rejections in production
    if (process.env.NODE_ENV === "development") {
        process.exit(1);
    }
});
const onListening = () => {
    const addr = server.address();
    console.log(`🚀 Server listening on port ${port} with PID ${pid}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
};
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            console.error(`❌ Port ${port} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`❌ Port ${port} is already in use`);
            process.exit(1);
        default:
            console.error(`❌ Server error:`, error);
            process.exit(1);
    }
};
const startServer = () => {
    try {
        server.listen(port);
        server.keepAliveTimeout = 90000;
        server.headersTimeout = 100000;
        server.on("error", onError);
        server.on("listening", onListening);
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
// Add graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...");
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});
startServer();
exports.default = server;
