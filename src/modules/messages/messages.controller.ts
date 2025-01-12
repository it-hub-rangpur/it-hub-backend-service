import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { messagesService } from "./messages.service";
import { socketIo } from "../../socket";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.sendMessage("its works!");

  socketIo.emit("message", result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages send Successfully!",
    data: result,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.create(req.body);

  socketIo.emit("message", result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Created Successfully!",
  });
});

const autoOtp = catchAsync(async (req: Request, res: Response) => {
  // const payload = {
  // time: "01/11, 11:12 PM",
  // key: "From : +8801708404440, \nTo: ,\nBody: 786567 is your one time password for verification",
  // };

  const payload = req.body;
  const form = payload?.key?.split(",")[0].split(":")[1]?.trim();

  const to = req?.query?.to as string;
  const otp = payload?.key?.split("Body:")[1]?.split(" ")[1]?.trim() as string;

  socketIo.emit("message", payload);

  if (otp?.length === 6) {
    socketIo.emit("otp-get", { to, otp });
    await messagesService.autoOtp({ to, otp });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP Get Successfully!",
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Message Received!",
    });
  }
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
};
