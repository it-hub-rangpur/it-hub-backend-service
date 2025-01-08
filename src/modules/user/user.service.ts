const create = async (payload: any) => {
  console.log(payload);
  return payload;
};
const getAll = async () => {
  return [];
};

export const userService = {
  create,
  getAll,
};
