import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { reCaptchaService } from "./reCaptcha.service";

const getReCaptchaToken = catchAsync(async (req: Request, res: Response) => {
  const result = await reCaptchaService.getReCaptchaToken();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recaptcha Created Successfully!",
    data: result,
  });
});

export const reCaptchaController = {
  getReCaptchaToken,
};
