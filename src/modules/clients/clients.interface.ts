import { Model } from "mongoose";

export interface IClient extends Document {
  _id?: string;
  companyName?: string;
  propritor?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  visaFiles?: string[];
}

export interface IClientModel extends Model<IClient> {}

// export interface IClientModel extends Model<IClient, {}, {}> {
//   isUserExist(
//     email: string
//   ): Promise<Pick<
//     IClient,
//     "name" | "_id" | "password" | "email" | "phone"
//   > | null>;
//   isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// }
