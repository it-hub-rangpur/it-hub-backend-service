import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

export default catchAsync(async (req: Request, res: Response) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetURL = "https://payment.ivacbd.com" + url.pathname + url.search;

  if (req.method === "OPTIONS") {
    // Handle preflight request
    res.status(204).set({
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // Cache preflight response for 24 hours
    });
    return res.end();
  }

  const apiResponse = await fetch(targetURL, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  const modifiedHeaders = new Headers(apiResponse.headers);
  modifiedHeaders.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  modifiedHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  modifiedHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const responseBody = await apiResponse.text();
  res
    .status(apiResponse.status)
    .set(Object.fromEntries(modifiedHeaders))
    .send(responseBody);
});
