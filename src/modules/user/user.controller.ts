import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { IUser } from "./user.interface";

const create = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully!",
    data: response,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: response,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get Successfully!",
    data: response,
  });
});

const auth = catchAsync(async (req: Request, res: Response) => {
  const user: Partial<IUser> = req.user!;
  const response = await userService.getOne(user?._id!);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "Login User Recvied Successfully!",
    data: response,
  });
});

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.updateOne(req.body);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User Update Successfully!",
    data: response,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.deleteOne(req.body?._id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User Delete Successfully!",
    data: response,
  });
});

export const userController = {
  create,
  getAll,
  login,
  auth,
  updateOne,
  deleteOne,
};
