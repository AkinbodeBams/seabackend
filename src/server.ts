import "dotenv/config";
import http from "http";
import app from "./app";

const port = 3000;
const { pid } = process;

app.set("port", port);
const server = http.createServer(app);

process.on("unhandledRejection", (reason: any): void => {
  throw reason;
});

const onListening = () => {
  const addr = server.address();
  const message = `🚀 Server listening on ${port} with PID ${pid}`;
  console.log(message);
};

const onError = (error: any) => {
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

export default startServer;
