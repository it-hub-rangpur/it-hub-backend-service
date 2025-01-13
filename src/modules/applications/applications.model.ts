import { Schema, model } from "mongoose";
import { IApplication, IApplicationModel } from "./applications.interface";

const applicationSchema: Schema<IApplication> = new Schema<IApplication>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
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
    email: {
      type: String,
      required: true,
      unique: false,
    },
    phone: {
      type: String,
      required: true,
    },
    info: [
      {
        name: {
          type: String,
          required: true,
        },
        bgdId: {
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
    hash_params: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    resend: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Application = model<IApplication, IApplicationModel>(
  "application",
  applicationSchema
);

export default Application;
