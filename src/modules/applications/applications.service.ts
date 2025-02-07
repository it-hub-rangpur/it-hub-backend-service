import httpStatus from "http-status";
import {
  amountChangeData,
  centers,
  ivacs,
  paymentOptions,
  visaTypes,
} from "../../Constants/ApplicationsContans";
import ApiError from "../../errorHandelars/ApiError";
import Client from "../clients/clients.model";
import { IApplication } from "./applications.interface";
import Application from "./applications.model";
import { IUser } from "../user/user.interface";
import generateNextDay from "../../utils/generateNextDay";

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
  }).sort({ createdAt: -1 });
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

export const applicationService = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getReadyApplications,
  updateByPhone,
};
