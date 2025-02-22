import { Model } from "mongoose";
import { IApplication } from "../applications/applications.interface";

export interface IClient extends Document {
  _id?: string;
  companyName?: string;
  propritor?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  applications?: string[] | IApplication[];
  tokenAmount: number;
  currentBalance: number;
  users?: string[];
  transactions?: string[];
}

export interface IClientModel extends Model<IClient> {}
