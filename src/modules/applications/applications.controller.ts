import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { applicationService } from "./applications.service";
import { IUser } from "../user/user.interface";
import { socketIo } from "../../socket";
import ApiError from "../../errorHandelars/ApiError";
import pick from "../../shared/Pick";
import { paginationFields } from "../../Constants/Pagination";
import { applicationFilterableFields } from "./applications.model";

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

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, applicationFilterableFields);

  const response = await applicationService.getAllApplications(
    paginationOptions,
    filters
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applications Get Successfully!",
    data: response,
  });
});

const getAllCompleted = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.getAllCompleted(
    req.user as Partial<IUser>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applications Get Successfully!",
    data: response,
  });
});

const getAllByAdmin = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, applicationFilterableFields);

  const response = await applicationService.getAllByAdmin(
    paginationOptions,
    filters
  );
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
  const isExist = await applicationService.getOne(req.params.id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  if (isExist?.paymentStatus?.url) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Application already approved, you can't update"
    );
  }

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
    req.params.id,
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
  const isExist = await applicationService.getOne(req.params.id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  if (isExist?.paymentStatus?.url) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Application already approved, you can't delete"
    );
  }

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

const setSlotDates = catchAsync(async (req: Request, res: Response) => {
  socketIo.emit("get-times", req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot Times set successfully",
  });
});

const getProcessApplications = catchAsync(
  async (req: Request, res: Response) => {
    const response = await applicationService.getProcessApplicationById(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Application Get Successfully!",
      data: response,
    });
  }
);

const updateApplicatonComplete = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    const response = await applicationService.applicationComplete(
      req.params.id,
      status
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Application Update Successfully!",
      data: response,
    });
  }
);

const moveToOngoing = catchAsync(async (req: Request, res: Response) => {
  const response = await applicationService.moveToOngoing(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Moved Successfully!",
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
  setSlotDates,
  getProcessApplications,
  updateApplicatonComplete,
  moveToOngoing,
  getAllByAdmin,
  getAllCompleted,
  getAllApplications,
};
