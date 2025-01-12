import { Model, Schema } from "mongoose";

export interface IApplication extends Document {
  _id?: string;
  client: Schema.Types.ObjectId | string;
  center: number;
  ivac: number;
  visaType: number;
  email: string;
  phone: string;
  otp: string;
  hash_params: string;
  info: { name: string; bgdId: string }[];
  status: boolean;
  resend: number;
}

export interface IApplicationModel extends Model<IApplication, {}, {}> {}
