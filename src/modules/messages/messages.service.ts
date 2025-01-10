import Message, { IMessage } from "./messages.model";

const sendMessage = async (payload: string) => {
  console.log(payload);
  return payload;
};

const create = async (payload: IMessage) => {
  const response = await Message.create(payload);
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
};
