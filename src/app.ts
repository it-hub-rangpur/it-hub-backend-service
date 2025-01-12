import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import httpStatus from "http-status";
import rootRouter from "./routes";
import globalErrorHandler from "./middlewares/GlobalErrorHandelar";

const app = express();

export const allowedOrigins = [
  "https://payment.ivacbd.com",
  "https://it-hub.programmerhub.xyz",
  "http://localhost:3000",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

// app.use(
//   express.json({
//     limit: "50mb",
//   })
// );

app.get("/", (req: Request, res: Response) => {
  res.send("It-Hub Server is Running...");
});

app.use("/api/v1", rootRouter);

app.use(globalErrorHandler);

app.all("*", (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({ message: "no route found" });
});

export default app;
