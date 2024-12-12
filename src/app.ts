import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import httpStatus from "http-status";
import rootRouter from "./routes";
import globalErrorHandler from "./middlewares/GlobalErrorHandelar";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("It-Hub Server is Running...");
});

app.use("/api/v1", rootRouter);

app.use(globalErrorHandler);

app.all("*", (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({ message: "no route found" });
});

export default app;
