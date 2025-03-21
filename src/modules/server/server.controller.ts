import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { serverService } from "./server.service";

const createNewSession = catchAsync(async (req: Request, res: Response) => {
  const proxyInfo = {
    protocol: "http",
    host: "103.104.143.145",
    port: 8927,
    auth: {
      username: "user272565",
      password: "uw7eg9",
    },
  };
  const response = await serverService.createNewSession(res);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "Session Created Successfully!",
  //   data: response,
  // });
});

const loginToServer = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: "",
  });
});

export const serverController = {
  loginToServer,
  createNewSession,
};
