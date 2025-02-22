import { Schema, model } from "mongoose";
import { ITransction, ITransctionModel } from "./transaction.interface";

const transactionSchema: Schema<ITransction> = new Schema<ITransction>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    files: {
      type: String || Schema.Types.ObjectId,
      default: null,
      ref: "Application",
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    payAmount: {
      type: Number,
      required: true,
    },
    paymentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model<ITransction, ITransctionModel>(
  "Transaction",
  transactionSchema
);

export default Transaction;
