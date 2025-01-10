import { Model, Schema } from "mongoose";

export interface IApplication extends Document {
  _id?: string;
  client: Schema.Types.ObjectId | string;
  center: number;
  ivac: number;
  visaType: number;
  email: string;
  phone: string;
  info: { name: string; bgdId: string }[];
  status: boolean;
}

export interface IApplicationModel extends Model<IApplication, {}, {}> {}
