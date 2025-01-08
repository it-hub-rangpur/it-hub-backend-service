import jwt from "jsonwebtoken";
import envConfig from "../configs/envConfig";
import { IUser } from "../modules/user/user.interface";

const generateToken = (userInfo: Partial<IUser>) => {
  const { _id, username, role, email, phone } = userInfo;
  const payload = {
    username,
    role,
    email,
    phone,
    _id,
  };

  const token = jwt.sign(payload, envConfig.secretKey!, {
    expiresIn: "10H",
  });

  return token;
};

export default generateToken;
