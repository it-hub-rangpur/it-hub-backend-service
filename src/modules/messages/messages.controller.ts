import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { messagesService } from "./messages.service";
import { socketIo } from "../../socket";
import Message, { IMessage } from "./messages.model";

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

const testSocket = catchAsync(async (req: Request, res: Response) => {
  const params = req.params;
  const query = req.query;
  const body = req.body;

  socketIo.emit("test", { body, params, query });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages send Successfully!",
    data: { body, params, query },
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.create(req.body);
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
  // const result = await messagesService.create(body);
  await messagesService.create(body);
  // const payload = {
  //   time: "01/11, 11:12 PM",
  //   key: "From : +8801708404440, \nTo: ,\nBody: 786567 is your one time password for verification",
  // };

  const loginOtpregex = /(\d{6})\s.*(password for ivac login)/i;
  const payOtpregex = /(\d{6})\s.*(password for verification)/i;
  const dbblmobilebankingOtpregex =
    /(\d{6})\s.*(Your security code for Rocket transaction is)/i;

  const loginMatch = body.key.match(loginOtpregex);
  const payMatch = body.key.match(payOtpregex);
  const dbblmobilebankingMatch = body.key.match(dbblmobilebankingOtpregex);

  if (loginMatch) {
    console.log("This is a login OTP.");
    console.log(`Code: ${loginMatch[1]}`);
  } else if (payMatch) {
    console.log("This is a payment OTP.");
    console.log(`Code: ${payMatch[1]}`);
  } else if (dbblmobilebankingMatch) {
    console.log("This is a Rocket OTP.");
    console.log(`Code: ${dbblmobilebankingMatch[1]}`);
  } else {
    console.log("No valid OTP found.");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Created Successfully!",
  });
});

const sendAutoOtp = catchAsync(async (req: Request, res: Response) => {
  const phone = req.params.phone;
  const message = req?.query?.msg as string;
  const form = message?.split("\n")[0];
  const body = message?.split("\n")[1];

  socketIo.emit("auto-otp", { form, body, phone });

  const loginOtpregex = /(\d{6})\s.*(password for ivac login)/i;
  const payOtpregex = /(\d{6})\s.*(password for verification)/i;
  const dbblmobilebankingOtpregex =
    /Your security code for Rocket transaction is (\d{6})/i;
  // const dbblmobilebankingOtpregex =
  //   /(\d{6})\s.*(Your security code for Rocket transaction is)/i;

  const loginMatch = body.match(loginOtpregex);
  const payMatch = body.match(payOtpregex);
  const dbblmobilebankingMatch = body.match(dbblmobilebankingOtpregex);

  // const dbblMessage = "Your security code for Rocket transaction is 705065.";
  // const dbblmobilebankingOtpregex =
  //   /(\d{6})\s.*(Your security code for Rocket transaction is)/i;

  //   const dbblmobilebankingMatch = dbblMessage.match(dbblmobilebankingOtpregex);

  if (loginMatch) {
    const otp = loginMatch[1];
    if (otp?.length === 6) {
      socketIo.emit("login-send-otp", { otp, form, phone });
      // socketIo.emit("login-otp-get", { to: phone, otp: otp });
    }
  } else if (payMatch) {
    const otp = payMatch[1];
    if (otp?.length === 6) {
      socketIo.emit("pay-send-otp", { otp, form, phone });
      // socketIo.emit("pay-otp-get", { to: phone, otp: otp });
    }
  } else if (dbblmobilebankingMatch) {
    const otp = dbblmobilebankingMatch[1];
    if (otp?.length === 6) {
      socketIo.emit("dbblmobilebanking-otp", { otp, form, acc: phone });
    }
  } else {
    console.log("No valid OTP found.");
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
  testSocket,
};
