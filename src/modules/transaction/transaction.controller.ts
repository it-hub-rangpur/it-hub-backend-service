import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { transactionServices } from "./transaction.service";
import { ITransction } from "./transaction.interface";

const clientPayment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const body = req?.body;

  const amount = Number(body?.amount ?? "0");
  const discount = Number(body?.discount ?? "0");
  const payAmount = amount - discount;

  const payload = {
    company: body?.company,
    type: "payment",
    files: "",
    amount: amount,
    discount: discount,
    payAmount: payAmount,
    paymentBy: user?._id as string,
    comment: body?.comment,
  };
  const response = await transactionServices.clientPayment(
    payload as ITransction
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment Created Successfully!",
    data: response,
  });
});

const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const response = await transactionServices.getAll();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction Get Successfully!",
    data: response,
  });
});

export const transactionController = {
  clientPayment,
  getAllTransaction,
};
