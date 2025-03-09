import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { reCaptchaService } from "./reCaptcha.service";
import axios from "axios";

const getReCaptchaToken = catchAsync(async (req: Request, res: Response) => {
  const result = await reCaptchaService.getReCaptchaToken();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recaptcha Created Successfully!",
    data: result,
  });
});

const validateGoogleReCaptcha = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;

    const params = new URLSearchParams({
      secret: "6LcWlLgqAAAAAJPiQKk7BA87lXgZ2U2J62LKbCq_",
      response: body.token,
      remoteip: req.ip,
    });

    console.log(body);
    console.log(params);

    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Captcha validate successfully",
          data: data,
        });
      });
    // const validateResponse = await axios.post(
    //   "https://www.google.com/recaptcha/api/siteverify",
    //   {
    //     secret: "6LcWlLgqAAAAAJPiQKk7BA87lXgZ2U2J62LKbCq_",
    //     response: body.token,
    //     remoteip: req.ip,
    //   }
    // );

    // console.log(body);

    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Captcha validate successfully",
    //   data: validateResponse,
    // });
  }
);

const getReCaptchaTokenByNope = catchAsync(
  async (req: Request, res: Response) => {
    const response = await reCaptchaService.getReCaptchaTokenByNope();

    console.log("response", response);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recaptcha Created Successfully!",
      data: response,
    });
  }
);

export const reCaptchaController = {
  getReCaptchaToken,
  validateGoogleReCaptcha,
  getReCaptchaTokenByNope,
};
