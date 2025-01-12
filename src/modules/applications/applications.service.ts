import {
  amountChangeData,
  centers,
  ivacs,
  visaTypes,
} from "../../Constants/ApplicationsContans";
import { IApplication } from "./applications.interface";
import Application from "./applications.model";

const create = async (payload: IApplication) => {
  const result = await Application.create(payload);
  return result;
};

const getAll = async () => {
  const result = await Application.find({}).populate("client");
  return result;
};

const getOne = async (id: string) => {
  const result = await Application.findById(id).select("-password");
  return result;
};

const updateOne = async (id: string, payload: IApplication) => {
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

const deleteOne = async (id: string) => {
  const response = await Application.findByIdAndDelete(id);
  return response;
};

const getReadyApplications = async () => {
  const result = await Application.find({ status: false });

  const readyData = result.map((item) => {
    const info = item?.info?.map((data) => {
      return {
        web_id: data?.bgdId,
        web_id_repeat: data?.bgdId,
        name: data?.name,
        phone: item?.phone,
        otp: item?.otp,
        email: item?.email,
        amount: 800.0,
        center: centers[item?.center],
        ivac: ivacs[item?.ivac],
        visa_type: visaTypes[item?.visaType],
        amountChangeData,
        confirm_tos: true,
      };
    });

    return {
      _token: "",
      apiKey: "",
      action: "sendOtp",
      resend: 0,
      otp: item?.otp,
      hash_params: item?.hash_params,
      info,
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
