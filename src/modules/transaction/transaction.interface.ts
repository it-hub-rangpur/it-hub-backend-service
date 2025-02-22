import { Model } from "mongoose";
import { IClient } from "../clients/clients.interface";
import { IUser } from "../user/user.interface";
import { IApplication } from "../applications/applications.interface";

export interface ITransction extends Document {
  _id?: string;
  company?: string | IClient;
  type: string;
  files?: string | IApplication;
  amount: number | string;
  discount: number | string;
  payAmount: number | string;
  paymentBy: string | IUser;
  comment: string;
}

export interface ITransctionModel extends Model<ITransction> {}
