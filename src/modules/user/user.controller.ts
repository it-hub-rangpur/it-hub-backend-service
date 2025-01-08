import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createNewUser = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.create(req.body);
  console.log(response);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully!",
    data: response,
  });
});

export const userController = {
  createNewUser,
};
