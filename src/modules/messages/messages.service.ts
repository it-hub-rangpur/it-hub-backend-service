const sendMessage = async (payload: string) => {
  console.log(payload);

  return payload;
};

export const messagesService = {
  sendMessage,
};
