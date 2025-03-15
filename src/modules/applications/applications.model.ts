import { Schema, model, Document, Model } from "mongoose";
import { IApplication, IApplicationModel } from "./applications.interface";

const applicationSchema: Schema<IApplication> = new Schema<IApplication>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    assignTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    center: {
      type: Number,
      required: true,
    },
    ivac: {
      type: Number,
      required: true,
    },
    visaType: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    visit_purpose: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    info: [
      {
        name: {
          type: String,
          required: true,
        },
        web_id: {
          type: String,
          required: true,
        },
      },
    ],
    otp: {
      type: String,
      maxlength: 6,
      minlength: 6,
    },
    slot_dates: {
      type: [String],
      default: [],
    },
    slot_time: [
      {
        id: { type: Number, required: true, default: 0 },
        ivac_id: { type: Number, required: true, default: 0 },
        visa_type: { type: Number, required: true, default: 0 },
        hour: { type: Number, required: true, default: 0 },
        date: { type: String, required: true, default: "" },
        availableSlot: { type: Number, required: true, default: 0 },
        time_display: { type: String, required: true, default: "" },
      },
    ],
    hash_params: { type: String, default: "" },
    resend: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
    paymentStatus: {
      status: { type: String, default: "" },
      url: { type: String, default: "" },
      order_id: { type: String, default: "" },
      token_no: { type: String, default: "" },
    },
    paymentDate: { type: Date, default: null },
    autoPayment: { type: Boolean, default: false },
    accountNumber: { type: String, default: "" },
    pinNumber: { type: String, default: "" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Application = model<IApplication, IApplicationModel>(
  "Application",
  applicationSchema
);

export const applicationFilterableFields = ["searchTerm", "fileStatus"];
export type IApplicationFilters = {
  searchTerm?: string;
  fileStatus?: string;
};

export const bookSearchableFields = [
  "title",
  "author",
  "genre",
  "publicationDate",
];

export default Application;
