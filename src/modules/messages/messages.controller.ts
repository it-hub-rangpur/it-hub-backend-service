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
  await messagesService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages Created Successfully!",
  });
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
};
