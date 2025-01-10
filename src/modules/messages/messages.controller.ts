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

export const messagesController = {
  sendMessage,
};
