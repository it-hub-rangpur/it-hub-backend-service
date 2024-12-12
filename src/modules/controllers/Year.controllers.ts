import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { yearServices } from "../services/Year.services";
import { IYear } from "../models/YearModal";
import { Request, Response } from "express";

const getAllYears = catchAsync(async (req: Request, res: Response) => {
  const response = await yearServices.getAllYears();

  sendResponse<IYear[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "year recvied successfully",
    data: response,
  });
});

export const yearController = { getAllYears };
