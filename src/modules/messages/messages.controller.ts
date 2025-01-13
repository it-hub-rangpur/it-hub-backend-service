import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { messagesService } from "./messages.service";
import { socketIo } from "../../socket";
import { IMessage } from "./messages.model";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const params = req.params;
  const query = req.query;
  const body = req.body;

  // const result = await messagesService.sendMessage("its works!");
  socketIo.emit("message", { body, params, query });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages send Successfully!",
    data: { body, params, query },
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  // const result = await messagesService.create(req.body);
  const params = req.params;
  const query = req.query;

  socketIo.emit("message", { data: req.body, params, query });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Created Successfully!",
  });
});

const autoOtp = catchAsync(async (req: Request, res: Response) => {
  const body = req.query.msg as IMessage["data"];
  const result = await messagesService.create(body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Created Successfully!",
  });

  // const payload = {
  // time: "01/11, 11:12 PM",
  // key: "From : +8801708404440, \nTo: ,\nBody: 786567 is your one time password for verification",
  // };

  // const payload = req.body;
  // const form = payload?.key?.split(",")[0].split(":")[1]?.trim();

  // const messageBody = payload?.key?.split("\n")[1];
  // const OTP = messageBody
  //   ?.split("is your one time password for verification")[0]
  //   ?.trim();

  // const to = req?.query?.to as string;

  // if (OTP?.length === 6) {
  //   socketIo.emit("otp-get", { to, otp: OTP });
  //   await messagesService.autoOtp({ to, otp: OTP });
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: "OTP Get Successfully!",
  //   });
  // } else {
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: "Message Received!",
  //   });
  // }
});

const sendAutoOtp = catchAsync(async (req: Request, res: Response) => {
  const phone = req.params.phone;
  const message = req?.query?.msg as string;
  const form = message?.split("\n")[0];
  const body = message?.split("\n")[1];

  const OTP = body
    ?.split("is your one time password for verification")[0]
    ?.trim();

  socketIo.emit("send-otp", { OTP, form, phone });
  if (OTP?.length === 6) {
    socketIo.emit("otp-get", { to: phone, otp: OTP });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message Received!",
  });

  // const messageBody = payload?.key?.split("\n")[1];
  // const OTP = messageBody
  //   ?.split("is your one time password for verification")[0]
  //   ?.trim();

  // if (OTP?.length === 6) {
  //   socketIo.emit("otp-get", { to: phone, otp: OTP });
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: "OTP Get Successfully!",
  //   });
  // } else {
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: "Message Received!",
  //   });
  // }
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const response = await messagesService.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Get Successfully!",
    data: response,
  });
});

export const messagesController = {
  sendMessage,
  create,
  getAll,
  autoOtp,
  sendAutoOtp,
};
