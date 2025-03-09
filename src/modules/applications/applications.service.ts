import httpStatus from "http-status";
import { paymentOptions } from "../../Constants/ApplicationsContans";
import ApiError from "../../errorHandelars/ApiError";
import Client from "../clients/clients.model";
import { IApplication } from "./applications.interface";
import Application from "./applications.model";
import { IUser } from "../user/user.interface";
import generateNextDay from "../../utils/generateNextDay";
import { transactionServices } from "../transaction/transaction.service";
import { ITransction } from "../transaction/transaction.interface";
import Transaction from "../transaction/transaction.model";

const create = async (payload: IApplication) => {
  const company = await Client.findById(payload.companyId);

  if (!company?._id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found");
  }

  const result = await Application.create({
    ...payload,
    paymentAmount: company?.tokenAmount * payload?.info?.length,
  });

  await Client.updateOne(
    { _id: payload.companyId },
    { $push: { applications: result._id } }
  );

  return result;
};

const getAll = async (user: Partial<IUser>) => {
  const result = await Application.find({
    assignTo: user._id,
    status: false,
  })
    .sort({ createdAt: 1 })
    .populate("companyId")
    .populate("assignTo");
  return result;
};
const getAllCompleted = async (user: Partial<IUser>) => {
  const result = await Application.find({
    assignTo: user._id,
    status: true,
  })
    .sort({ createdAt: -1 })
    .populate("companyId")
    .populate("assignTo");
  return result;
};

const getAllByAdmin = async (user: Partial<IUser>) => {
  const result = await Application.find({})
    .sort({ createdAt: -1 })
    .populate("companyId")
    .populate("assignTo");
  return result;
};

const getOne = async (id: string) => {
  const result = await Application.findById(id).select("-password");
  return result;
};

const updateOne = async (id: string, payload: IApplication) => {
  if (payload?.status) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Application already approved");
  }

  if (payload?.paymentStatus?.status) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Application already approved");
  }

  const response = await Application.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return response;
};

const updateByPhone = async (phone: string, payload: Partial<IApplication>) => {
  const response = await Application.findOneAndUpdate({ phone }, payload, {
    new: true,
  });
  return response;
};

const deleteOne = async (id: string, payload: Partial<IApplication>) => {
  if (payload?.paymentStatus?.status) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Application already approved");
  }

  const response = await Application.findByIdAndDelete(id);
  await Client.updateOne(
    { _id: payload.companyId },
    { $pull: { applications: id } }
  );
  return response;
};

const getReadyApplications = async (userId: string) => {
  const result = await Application.find({ assignTo: userId, status: false });

  const readyData = result.map((item) => {
    return {
      _id: item?._id,
      _token: "",
      resend: 0,
      center: item?.center,
      ivac: item?.ivac,
      visaType: item?.visaType,
      phone: item?.phone,
      password: item?.password,
      info: item?.info,
      otp: item?.otp,
      visit_purpose: item?.visit_purpose,
      hash_params: item?.hash_params,
      selected_payment: paymentOptions[item?.paymentMethod],
      createdAt: item?.createdAt,
      slot_dates: item?.slot_dates?.length
        ? item?.slot_dates
        : [generateNextDay()],
    };
  });
  return readyData;
};

const getProcessApplicationById = async (id: string) => {
  const result = await Application.findById(id);

  return {
    _id: result?._id,
    _token: "",
    resend: 0,
    center: result?.center,
    ivac: result?.ivac,
    visaType: result?.visaType,
    phone: result?.phone,
    email: result?.email,
    password: result?.password,
    info: result?.info,
    otp: result?.otp,
    visit_purpose: result?.visit_purpose,
    hash_params: result?.hash_params,
    selected_payment: paymentOptions[result?.paymentMethod as string],
    createdAt: result?.createdAt,
    slot_dates: result?.slot_dates?.length
      ? result?.slot_dates
      : [generateNextDay()],
    paymentStatus: result?.paymentStatus,
    status: result?.status,
    autoPayment: result?.autoPayment,
    accountNumber: result?.accountNumber,
    pinNumber: result?.pinNumber,
  };
};

const applicationComplete = async (id: string) => {
  const result = await Application.findByIdAndUpdate(
    {
      _id: id,
    },
    { status: true },
    { new: true }
  );

  const payload = {
    company: result?.companyId,
    type: "invoice",
    files: result?.info?.length,
    amount: result?.paymentAmount,
    discount: 0,
    payAmount: result?.paymentAmount,
    paymentBy: result?.assignTo,
    comment: "",
  };

  if (result?._id) {
    await transactionServices.clientInvoice(payload as ITransction);
  }
  return result;
};

const moveToOngoing = async (id: string) => {
  const result = await Application.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      status: false,
      paymentStatus: {
        status: "",
        url: "",
      },
    },
    { new: true }
  );

  if (result?._id) {
    await Client.updateOne(
      { _id: result?.companyId },
      {
        $inc: { currentBalance: result?.paymentAmount },
      }
    );
  }

  return result;
};

export const applicationService = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getReadyApplications,
  updateByPhone,
  getProcessApplicationById,
  applicationComplete,
  moveToOngoing,
  getAllByAdmin,
  getAllCompleted,
};
