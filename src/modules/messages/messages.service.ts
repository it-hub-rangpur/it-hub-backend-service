import Application from "../applications/applications.model";
import Message, { IMessage } from "./messages.model";

const sendMessage = async (payload: string) => {
  console.log(payload);
  return payload;
};

const create = async (payload: IMessage) => {
  const response = await Message.create({
    data: payload,
  });
  return response;
};

const autoOtp = async ({ to, otp }: { to: string; otp: string }) => {
  const response = await Application.updateOne({
    phone: to,
    otp: otp,
  });
  return response;
};

const getAll = async () => {
  const response = await Message.find({}).sort({ createdAt: -1 });
  return response;
};

export const messagesService = {
  sendMessage,
  create,
  getAll,
  autoOtp,
};
