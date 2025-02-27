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
import generateNextDay from "../../utils/generateNextDay";

const manageQueue = catchAsync(async (req: Request, res: Response) => {
  // await visaApiService.apiManageQueue(req, res);
  const result = await visaApiService.manageQueue();
  // await new Promise((resolve) => setTimeout(resolve, 50000));
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
      res.status(200).json(getVerifySuccessResponse);
    }
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

const getTimeSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.getTimeSlots();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // res.status(200).json(getTimesSlotsErrorResponse);

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
  // await new Promise((resolve) => setTimeout(resolve, 5000));
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

const mobileVerify = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("call");
  // res.status(200).json(getVerifySuccessResponse);
  res.status(302).redirect("/verfiy");
});

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // res.status(200).json({
  //   success: true,
  //   message: "Sms send successfully",
  // });

  res.status(500).json({
    success: false,
    message: "Slot is not available",
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  res.status(200).json({
    success: true,
    message: "",
    data: {
      slot_times: [],
      slot_dates: [generateNextDay()],
      status: true,
      error_reason: "",
    },
  });
});

const applicationInfoSubmit = catchAsync(
  async (req: Request, res: Response) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    res.header("Access-Control-Expose-Headers", "Location");
    res.status(302).redirect("https://payment.ivacbd.com/personal-info");
  }
);

const personalInfoSubmit = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.header("Access-Control-Expose-Headers", "Location");
  res.status(302).redirect("https://payment.ivacbd.com/overview");
});

const overviewInfoSubmit = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.header("Access-Control-Expose-Headers", "Location");
  res.status(302).redirect("https://payment.ivacbd.com/payment");
});

const payTimeSlots = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  res.status(200).json({
    success: true,
    message: "",
    data: {
      success: true,
      message: "Slot found",
      data: {
        status: "OK",
        data: [""],
        slot_dates: [generateNextDay()],
        slot_times: [
          {
            id: 180004,
            ivac_id: 2,
            visa_type: 18,
            hour: 10,
            date: generateNextDay(),
            availableSlot: 0,
            time_display: "10:00 - 10:59",
          },
        ],
      },
    },
  });
});

const slotPayNow = catchAsync(async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  res.status(200).json({
    success: true,
    message: "Slot booking initiated",
    url: "https://securepay.sslcommerz.com/gwprocess/v4/gw.php?Q=REDIRECT&SESSIONKEY=43828262A4B047AF73176050C1D9163B&cardname=",
  });

  // res.status(500).json({
  //   success: false,
  //   message: "Slot is not available",
  // });
});

export const visaApiController = {
  manageQueue,
  getTimeSlots,
  payInvoice,
  mobileVerify,
  sendOtp,
  verifyOtp,
  payTimeSlots,
  slotPayNow,
  applicationInfoSubmit,
  personalInfoSubmit,
  overviewInfoSubmit,
};
