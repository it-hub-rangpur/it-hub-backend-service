import Client from "../clients/clients.model";
import { ITransction } from "./transaction.interface";
import Transaction from "./transaction.model";

const clientPayment = async (data: ITransction) => {
  const response = await Transaction.create(data);
  if (response?._id) {
    await Client.updateOne(
      { _id: data?.company },
      {
        $inc: { currentBalance: response?.payAmount },
        $push: { transactions: response._id },
      }
    );
  }
  return data;
};

const clientInvoice = async (data: ITransction) => {
  const response = await Transaction.create(data);
  if (response?._id) {
    await Client.updateOne(
      { _id: data?.company },
      {
        $inc: { currentBalance: -response?.payAmount },
        $push: { transactions: response._id },
      }
    );
  }
  return data;
};

const getAll = async () => {
  const response = await Transaction.find({})
    .sort({ createdAt: -1 })
    .populate("paymentBy")
    .populate("company");
  return response;
};

export const transactionServices = {
  clientPayment,
  getAll,
  clientInvoice,
};
