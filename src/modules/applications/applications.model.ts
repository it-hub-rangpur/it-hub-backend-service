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
    status: {
      type: Boolean,
      default: false,
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
