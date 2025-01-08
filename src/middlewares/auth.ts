import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import ApiError from "../errorHandelars/ApiError";
import httpStatus from "http-status";
import envConfig from "../configs/envConfig";
const jwt = require("jsonwebtoken");

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
      }
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
      }

      const verifiedUser = await promisify(jwt.verify)(
        token,
        envConfig.secretKey
      );

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden, You are not Authorized!"
        );
      }
      req.user = verifiedUser;
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
