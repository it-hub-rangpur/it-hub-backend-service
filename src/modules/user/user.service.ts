import httpStatus from "http-status";
import ApiError from "../../errorHandelars/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";
import bcrypt from "bcrypt";

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
  return result;
};
const getAll = async () => {
  const result = await User.find({});
  return result;
};

export const userService = {
  create,
  getAll,
};
