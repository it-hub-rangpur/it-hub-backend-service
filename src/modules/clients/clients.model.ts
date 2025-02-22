import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IClient, IClientModel } from "./clients.interface";

const clientSchema: Schema<IClient> = new Schema<IClient>(
  {
    companyName: {
      type: String,
      trim: true,
      unique: true,
    },

    propritor: {
      type: String,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    applications: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    users: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    tokenAmount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    transactions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.statics.isUserExist = async function (username) {
  return await this.findOne(
    { username },
    { username, name: 1, email: 1, password: 1, role: 1, phone: 1 }
  );
};

clientSchema.statics.isPasswordMatched = async function (
  givenPassword,
  savedPassword
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const Client = model<IClient, IClientModel>("Client", clientSchema);

export default Client;
