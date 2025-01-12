import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { visaApiService } from "./visaApi.service";
import {
  getPaymentUrlSuccessResponse,
  getTimesSlotsErrorResponse,
  getTimesSlotsSuccessResponse,
  getVerifyErrorResponse,
  getVerifySuccessDateNull,
  getVerifySuccessResponse,
  sendOtpSuccess,
  slotNotAvailable,
} from "./visaApi.model";

const manageQueue = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.manageQueue();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // res.status(200).json(getVerifySuccessResponse);

  if (result === 200) {
    if (req?.body?.action === "sendOtp") {
      res.status(200).json(sendOtpSuccess);
    } else {
      res.status(200).json(getVerifySuccessResponse);
    }
  } else if (result === 422) {
    if (req?.body?.action === "sendOtp") {
      res.status(200).json(slotNotAvailable);
    } else {
      res.status(200).json(getVerifyErrorResponse);
    }
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else if (result === 500) {
    if (req?.body?.action === "sendOtp") {
      res.status(502).json({ message: "Bad Gateway" });
    } else {
      res.status(200).json(getVerifySuccessDateNull);
    }
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

const getTimeSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.getTimeSlots();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // res.status(200).json(getVerifySuccessResponse);

  if (result === 200) {
    res.status(200).json(getTimesSlotsSuccessResponse);
  } else if (result === 422) {
    res.status(200).json(getTimesSlotsErrorResponse);
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

const payInvoice = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.payInvoice();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // res.status(200).json(getVerifySuccessResponse);

  if (result === 200) {
    res.status(200).json(getPaymentUrlSuccessResponse);
  } else if (result === 422) {
    res.status(200).json(slotNotAvailable);
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

export const visaApiController = {
  manageQueue,
  getTimeSlots,
  payInvoice,
};
