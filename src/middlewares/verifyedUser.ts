import { RequestHandler } from "express";
import ApiError from "../errorHandelars/ApiError";
import httpStatus from "http-status";
import envConfig from "../configs/envConfig";
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const verifyedLoginUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      throw new ApiError(httpStatus.NOT_FOUND, "User Not Login");
    }
    const decoded = await promisify(jwt.verify)(token, envConfig.secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyedLoginUser;
