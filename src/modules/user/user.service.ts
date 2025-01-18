import httpStatus from "http-status";
import ApiError from "../../errorHandelars/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import Client from "../clients/clients.model";

const create = async (payload: IUser) => {
  const { email, password, username } = payload;

  if (!email || !password || !username) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "All fields are required");
  }

  const isUserExist = await User.isUserExist(username);

  if (isUserExist) {
    throw new ApiError(httpStatus.FORBIDDEN, "User already exists");
  }

  payload.password = bcrypt.hashSync(password, 10);
  const result = await User.create(payload);

  await Client.findByIdAndUpdate(
    result.companyId,
    { $push: { users: result._id } },
    { new: true }
  );

  return result;
};

const login = async (payload: IUser) => {
  const { username, password } = payload;

  const isUserExist = await User.isUserExist(username);
  if (!isUserExist) {
    throw new ApiError(httpStatus.FORBIDDEN, "User does not exist");
  }

  if (!isUserExist?.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is not active");
  }

  const matchPassword = await User.isPasswordMatched(
    password,
    isUserExist.password as string
  );

  if (!matchPassword) {
    throw new ApiError(401, "Password did not match");
  }

  const token = await generateToken(isUserExist);
  return token;
};

const getAll = async () => {
  const result = await User.find({
    role: {
      $nin: ["superadmin", "admin"],
    },
  })
    .populate("companyId")
    .select("-password");
  return result;
};

const getOne = async (id: string) => {
  const result = await User.findById(id)
    .select("-password")
    .populate("companyId");
  return result;
};
const updateOne = async (payload: IUser) => {
  const { _id, ...userData } = payload;

  if (userData?.password) {
    userData.password = bcrypt.hashSync(userData.password, 10);
  }

  const result = await User.findByIdAndUpdate({ _id }, userData, {
    new: true,
  });

  return result;
};

const deleteOne = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  await Client.updateOne({ _id: result?.companyId }, { $pull: { users: id } });
  return result;
};

export const userService = {
  create,
  login,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
