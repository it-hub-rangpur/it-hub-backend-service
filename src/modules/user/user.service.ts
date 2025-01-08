import httpStatus from "http-status";
import ApiError from "../../errorHandelars/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";

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

const login = async (payload: IUser) => {
  const { username, password } = payload;

  const isUserExist = await User.isUserExist(username);
  if (!isUserExist) {
    throw new ApiError(httpStatus.FORBIDDEN, "User does not exist");
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
  const result = await User.find({});
  return result;
};

const getOne = async (id: string) => {
  const result = await User.findById(id).select("-password");
  return result;
};

export const userService = {
  create,
  login,
  getAll,
  getOne,
};
