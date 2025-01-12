const manageQueue = async () => {
  return 200;
  const luckyNumber = Math.floor(Math.random() * 10) + 1;
  if (luckyNumber === 7) {
    return 200;
  } else if (luckyNumber === 8) {
    return 502;
  } else if (luckyNumber === 5) {
    return 422;
  } else if (luckyNumber === 3) {
    return 500;
  } else {
    return 504;
  }
};

const getTimeSlots = async () => {
  return 200;
  const luckyNumber = Math.floor(Math.random() * 10) + 1;
  if (luckyNumber === 7) {
    return 200;
  } else if (luckyNumber === 8) {
    return 502;
  } else if (luckyNumber === 5) {
    return 422;
  } else if (luckyNumber === 3) {
    return 500;
  } else {
    return 504;
  }
};

const payInvoice = async () => {
  return 200;
  const luckyNumber = Math.floor(Math.random() * 10) + 1;
  if (luckyNumber === 7) {
    return 200;
  } else if (luckyNumber === 8) {
    return 502;
  } else if (luckyNumber === 5) {
    return 422;
  } else if (luckyNumber === 3) {
    return 500;
  } else {
    return 504;
  }
};

export const visaApiService = {
  manageQueue,
  getTimeSlots,
  payInvoice,
};
