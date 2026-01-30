"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = 3000;
const { pid } = process;
app_1.default.set("port", port);
const server = http_1.default.createServer(app_1.default);
process.on("unhandledRejection", (reason) => {
    throw reason;
});
const onListening = () => {
    const addr = server.address();
    const message = `🚀 Server listening on ${port} with PID ${pid}`;
    console.log(message);
};
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${port} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
};
const startServer = () => {
    server.listen(port);
    server.keepAliveTimeout = 90000;
    server.headersTimeout = 100000;
    server.on("error", onError);
    server.on("listening", onListening);
};
startServer();
exports.default = startServer;
