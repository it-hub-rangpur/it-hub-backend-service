import httpStatus from "http-status";
import { paymentOptions } from "../../Constants/ApplicationsContans";
import ApiError from "../../errorHandelars/ApiError";
import Client from "../clients/clients.model";
import { IApplication } from "./applications.interface";
import Application, { IApplicationFilters } from "./applications.model";
import { IUser } from "../user/user.interface";
import generateNextDay from "../../utils/generateNextDay";
import { transactionServices } from "../transaction/transaction.service";
import { ITransction } from "../transaction/transaction.interface";
import { IPaginationOptions } from "../../utils/paginationFields";
import { paginationHelpers } from "../../helpers/PaginationHelper";
import { SortOrder, Types } from "mongoose";

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

const getAllByAdmin = async (
  paginationOptions: IPaginationOptions,
  filters: IApplicationFilters
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, fileStatus, ...filtersData } = filters;

  const andConditions = [];

  if (fileStatus) {
    if (fileStatus == "Completed") {
      andConditions.push({
        "paymentStatus.status": "SUCCESS",
        status: true,
      });
    } else if (fileStatus == "On Payment") {
      andConditions.push({
        "paymentStatus.status": "SUCCESS",
        status: false,
      });
    } else if (fileStatus == "On Progress") {
      andConditions.push({
        "paymentStatus.status": "",
        status: false,
      });
    } else if (fileStatus == "all") {
      andConditions.push({
        $or: [
          {
            "paymentStatus.status": "SUCCESS",
            status: false,
          },
          {
            "paymentStatus.status": "",
            status: false,
          },
          {
            status: true,
          },
        ],
      });
    }
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const total = await Application.countDocuments(whereConditions);
  const result = await Application.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate("companyId")
    .populate("assignTo");

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllApplications = async (
  paginationOptions: IPaginationOptions,
  filters: IApplicationFilters
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, fileStatus, ...filtersData } = filters;

  const andConditions = [];

  if (fileStatus) {
    if (fileStatus == "Completed") {
      andConditions.push({
        "paymentStatus.status": "SUCCESS",
        status: true,
      });
    } else if (fileStatus == "On Payment") {
      andConditions.push({
        "paymentStatus.status": "SUCCESS",
        status: false,
      });
    } else if (fileStatus == "On Progress") {
      andConditions.push({
        "paymentStatus.status": "",
        status: false,
      });
    } else if (fileStatus == "all") {
      andConditions.push({
        $or: [
          {
            "paymentStatus.status": "SUCCESS",
            status: false,
          },
          {
            "paymentStatus.status": "",
            status: false,
          },
          {
            status: true,
          },
        ],
      });
    }
  }

  if (filtersData?.assignTo) {
    andConditions.push({
      assignTo: new Types.ObjectId(filtersData?.assignTo),
    });
  }

  if (filtersData?.companyId) {
    andConditions.push({
      companyId: new Types.ObjectId(filtersData?.companyId),
    });
  }

  if (filtersData?.startDate && filtersData?.endDate) {
    andConditions.push({
      createdAt: {
        $gte: new Date(filtersData?.startDate),
        $lte: new Date(filtersData?.endDate),
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const total = await Application.countDocuments(whereConditions);
  const result = await Application.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOne = async (id: string) => {
  const result = await Application.findById(id);
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

const updateByPhone = async (id: string, payload: Partial<IApplication>) => {
  const response = await Application.findByIdAndUpdate(id, payload, {
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
      email: item?.email,
      info: item?.info,
      otp: item?.otp,
      visit_purpose: item?.visit_purpose,
      hash_params: item?.hash_params,
      selected_payment: paymentOptions[item?.paymentMethod],
      createdAt: item?.createdAt,
      slot_dates: item?.slot_dates?.length
        ? item?.slot_dates
        : [generateNextDay()],
      slot_time: item?.slot_time,
      paymentStatus: item?.paymentStatus,
      status: item?.status,
      autoPayment: item?.autoPayment,
      accountNumber: item?.accountNumber,
      pinNumber: item?.pinNumber,
      serverInfo: {
        action: item?.serverInfo?.action,
        isUserLoggedIn: item?.serverInfo?.isUserLoggedIn,
        csrfToken: item?.serverInfo?.csrfToken,
        isLoggedIn: false,
      },
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

const applicationComplete = async (id: string, status: string) => {
  let result;
  if (status === "Completed") {
    result = await Application.findByIdAndUpdate(
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
  } else if (status === "On Payment") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Application can't move to On Payment"
    );
  } else {
    result = await Application.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        paymentStatus: {
          status: "",
          url: "",
        },
        status: false,
      },
      { new: true }
    );
  }
  return status;
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
  getAllApplications,
};
