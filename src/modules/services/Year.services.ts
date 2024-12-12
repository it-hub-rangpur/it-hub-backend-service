import Year from "../models/YearModal";

const getAllYears = async () => {
  const result = await Year.find();
  return result;
};

export const yearServices = {
  getAllYears,
};
