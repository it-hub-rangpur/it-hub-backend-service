import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { applicationService } from "./applications.service";
import { IUser } from "../user/user.interface";

const create = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application Created Successfully!",
    data: response,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.getAll(req.user as Partial<IUser>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applications Get Successfully!",
    data: response,
  });
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.getOne(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Get Successfully!",
    data: response,
  });
});

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.updateOne(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Update Successfully!",
    data: response,
  });
});

const updateByPhone = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.updateByPhone(
    req.params.phone,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Update Successfully!",
    data: response,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.deleteOne(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Deleted Successfully!",
    data: response,
  });
});

const getReadyApplications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as Partial<IUser>;
  const response = await applicationService.getReadyApplications(
    user?._id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ready Applications Get Successfully!",
    data: response,
  });
});

export const applicationController = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  updateByPhone,
  getReadyApplications,
};
