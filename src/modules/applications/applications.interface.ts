import { Model, Schema } from "mongoose";

export interface IApplication extends Document {
  _id?: string;
  companyId: Schema.Types.ObjectId | string;
  assignTo: Schema.Types.ObjectId | string;
  center: number;
  ivac: number;
  visaType: number;
  phone: string;
  password: string;
  email: string;
  paymentMethod: string;
  visit_purpose: string;
  paymentAmount: number;
  info: { name: string; web_id: string }[];
  otp: string;
  slot_dates: string[];
  slot_time: {
    id: number;
    ivac_id: number;
    visa_type: number;
    hour: number;
    date: string;
    availableSlot: number;
    time_display: string;
  }[];
  hash_params: string;
  resend: number;
  status: boolean;
  paymentStatus: {
    status: string;
    url: string;
    order_id: string;
    token_no: string;
  };
  paymentDate: Date;
  autoPayment: boolean;
  accountNumber: string;
  pinNumber: string;
  createdAt: string;
  serverInfo: {
    action?: string;
    cookies: string[];
    csrfToken: string;
  };
}

export interface IApplicationModel extends Model<IApplication, {}, {}> {}
