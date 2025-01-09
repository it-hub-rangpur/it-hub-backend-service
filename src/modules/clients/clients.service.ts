import { IClient } from "./clients.interface";
import Client from "./clients.model";

const create = async (payload: IClient) => {
  const result = await Client.create(payload);
  return result;
};

const getAll = async () => {
  const result = await Client.find({});
  return result;
};

const getOne = async (id: string) => {
  const result = await Client.findById(id).select("-password");
  return result;
};

const updateById = async (id: string, payload: IClient) => {
  const result = await Client.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteById = async (id: string) => {
  const result = await Client.findByIdAndDelete(id);
  return result;
};

export const clientServices = {
  create,
  getAll,
  getOne,
  updateById,
  deleteById,
};
