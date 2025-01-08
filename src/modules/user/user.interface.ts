import { Model } from "mongoose";

type IUserRole = "admin" | "superadmin" | "user";

export type InitialUser = {
  _id?: string;
  username?: string;
  password: string;
  name?: string;
  email: string;
  phone?: string;
  role?: IUserRole;
};

export interface IUser extends Document {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  role?: IUserRole;
}

export interface IUserModel extends Model<IUser, {}, {}> {
  isUserExist(
    email: string
  ): Promise<Pick<
    IUser,
    "name" | "_id" | "password" | "role" | "email" | "phone"
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}
