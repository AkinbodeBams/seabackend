// src/server.ts
import "dotenv/config";
import http from "http";
import app from "./app";

const port = process.env.PORT || 3000;
const { pid } = process;

app.set("port", port);
const server = http.createServer(app);

process.on("unhandledRejection", (reason: any): void => {
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

const onError = (error: any) => {
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
  } catch (error) {
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

export default server;
