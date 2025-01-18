import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { clientServices } from "./clients.service";
import Client from "./clients.model";

const create = catchAsync(async (req: Request, res: Response) => {
  // const response = await Client.create(req.body);
  const response = await clientServices.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Client Created Successfully!",
    data: response,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const response = await clientServices.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client Get Successfully!",
    data: response,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const response = await clientServices.updateById(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client Updated Successfully!",
    data: response,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const response = await clientServices.deleteById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client Deleted Successfully!",
    data: response,
  });
});

export const clientController = {
  create,
  getAll,
  updateById,
  deleteById,
};
