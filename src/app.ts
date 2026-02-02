import express, { NextFunction, Request, Response } from "express";
import routes from "./routes/routes";
import { AppError } from "./util/appError";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Invalid Url , Please Check The Url`, 404));
});
// app.use(errorMiddleware);

export default app;
