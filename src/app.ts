// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import httpStatus from "http-status";
// import rootRouter from "./routes";
// import globalErrorHandler from "./middlewares/GlobalErrorHandelar";
// import cookieParser from "cookie-parser";

// const app = express();

export const allowedOrigins = [
  "https://payment.ivacbd.com",
  "https://it-hub.programmerhub.xyz",
  "https://it-hub-client-service.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5000--1b4252dd.local-credentialless.webcontainer-api.io/",
];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text());

// // app.use(
// //   express.json({
// //     limit: "50mb",
// //   })
// // );

// app.get("/", (req: Request, res: Response) => {
//   res.send("It-Hub Server is Running...");
// });

// app.use("/api/v1", rootRouter);

// app.use(globalErrorHandler);

// app.all("*", (req: Request, res: Response) => {
//   res.status(httpStatus.NOT_FOUND).json({ message: "no route found" });
// });

// export default app;

import express, { Request, Response } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const app = express();
app.use(express.json());

const TARGET_URL = "https://payment.ivacbd.com";

// Function to extract client IP
const getClientIP = (req: Request): string => {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

// Function to forward headers, cookies, and user-agent
const getForwardedHeaders = (
  req: Request
): { [key: string]: string | undefined } => {
  const headers: { [key: string]: string | string[] | undefined } = {
    ...req.headers,
  };

  // Remove headers that should not be forwarded or handled manually
  delete headers["host"];
  delete headers["content-length"];

  // Forward cookies from the original request
  if (req.headers.cookie) {
    headers["cookie"] = req.headers.cookie;
  }

  // Add X-Forwarded-For header to identify the client's IP
  headers["X-Forwarded-For"] = getClientIP(req);

  // Ensure User-Agent and sec-ch headers are forwarded correctly
  headers["User-Agent"] =
    headers["user-agent"] ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";
  headers["sec-ch-ua"] =
    '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"';
  headers["sec-ch-ua-mobile"] = "?0";
  headers["sec-ch-ua-platform"] = '"Windows"';
  headers["sec-fetch-site"] = "none";
  headers["sec-fetch-mode"] = "navigate";
  headers["sec-fetch-dest"] = "document";
  headers["sec-fetch-user"] = "?1";
  headers["sec-gpc"] = "1";
  headers["upgrade-insecure-requests"] = "1";
  headers["Referer"] = "https://payment.ivacbd.com";
  headers["Origin"] = "https://payment.ivacbd.com";

  // Adding more headers to avoid bot blocking
  headers["X-Requested-With"] = "XMLHttpRequest";
  headers["Cache-Control"] = "no-cache";
  headers["Accept-Encoding"] = "gzip, deflate, br";
  headers["DNT"] = "1";

  // Ensuring all headers are string values
  const stringHeaders: { [key: string]: string | undefined } = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      stringHeaders[key] = value.join(", "); // Join array values into a comma-separated string
    } else {
      stringHeaders[key] = value as string; // Cast value to string
    }
  }

  return stringHeaders;
};

app.use(async (req: Request, res: Response) => {
  try {
    const userIP = getClientIP(req);
    const forwardedHeaders = getForwardedHeaders(req);

    console.log(`Forwarding request from IP: ${userIP}`);

    // Send request with the user's headers and cookies
    const axiosConfig: AxiosRequestConfig = {
      url: `${TARGET_URL}${req.url}`,
      method: req.method,
      headers: forwardedHeaders,
      data: req.method === "POST" ? req.body : undefined, // Forward body for POST requests
      maxRedirects: 0, // Prevent automatic redirects
    };

    const response: AxiosResponse = await axios(axiosConfig);

    // Forward response headers and cookies
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string);
    });

    // Return the response data
    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error("Request failed:", error.message);

    // Handle possible errors more gracefully
    if (error.response) {
      console.error("Response error:", error.response.status);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

export default app;
