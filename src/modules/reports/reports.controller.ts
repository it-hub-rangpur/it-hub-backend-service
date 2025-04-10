import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { reportsService } from "./reports.service";

const getAvailableDatetime = catchAsync(async (req: Request, res: Response) => {
  const result = await reportsService.getAvailableDatetime();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recaptcha Created Successfully!",
    data: result,
  });
});

const testServer = catchAsync(async (req: Request, res: Response) => {
  const result = await reportsService.testServer();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Server is Running!",
    data: result,
  });
});

const testRedirectURL = catchAsync(async (req: Request, res: Response) => {
  res.header("Access-Control-Expose-Headers", "Location");
  res.status(302).redirect("https://google.com");
});

export const reportsController = {
  getAvailableDatetime,
  testServer,
  testRedirectURL,
};
