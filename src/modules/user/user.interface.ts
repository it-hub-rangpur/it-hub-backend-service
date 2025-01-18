import { Model } from "mongoose";
import { IClient } from "../clients/clients.interface";

type IUserRole =
  | "admin"
  | "superadmin"
  | "user"
  | "companyAdmin"
  | "companyUser";

export type InitialUser = {
  _id?: string;
  username?: string;
  password: string;
  name?: string;
  email: string;
  phone?: string;
  companyId: string | IClient;
  role?: IUserRole;
  isActive?: boolean;
};

export interface IUser extends Document {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  companyId: string | IClient;
  role?: IUserRole;
  isActive?: boolean;
}

export interface IUserModel extends Model<IUser, {}, {}> {
  isUserExist(
    email: string
  ): Promise<Pick<
    IUser,
    "name" | "_id" | "password" | "role" | "email" | "phone" | "isActive"
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}
