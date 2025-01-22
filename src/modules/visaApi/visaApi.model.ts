export const sendOtpSuccess = {
  status: "SUCCESS",
  code: 200,
  data: {
    status: true,
    error_reason: "Sms send successfully",
    webfile_error_data: [],
  },
  message: ["Sms send successfully"],
};

export const slotNotAvailable = {
  status: "FAILED",
  code: 422,
  data: {
    status: false,
    error_reason: "Slot is not available",
    webfile_error_data: [],
  },
  message: ["Slot is not available"],
};

const currentDate = new Date();
const dateAfter5Days = new Date(currentDate.setDate(currentDate.getDate() + 1))
  .toISOString()
  .split("T")[0];

export const getVerifySuccessResponse = {
  status: "SUCCESS",
  code: 200,
  data: {
    slot_times: [],
    slot_dates: [dateAfter5Days], //"2024-10-16" dateAfter5Days
    status: true,
    error_reason: "",
  },
  message: [""],
};

export const getVerifySuccessDateNull = {
  status: "SUCCESS",
  code: 200,
  data: {
    slot_times: [],
    slot_dates: [], //"2024-10-16" dateAfter5Days
    status: true,
    error_reason: "",
  },
  message: [""],
};

export const getVerifyErrorResponse = {
  status: "FAILED",
  code: 422,
  data: {
    status: false,
    error_reason: "OTP not found with this mobile number",
  },
  message: ["OTP not found with this mobile number"],
};

export const getTimesSlotsSuccessResponse = {
  status: "OK",
  data: [""],
  slot_dates: ["2024-10-17"],
  slot_times: [
    {
      id: 142049,
      ivac_id: 17,
      visa_type: 13,
      hour: 10,
      date: "2024-10-17",
      availableSlot: 1,
      time_display: "10:00 - 10:59",
    },
    {
      id: 142049,
      ivac_id: 17,
      visa_type: 13,
      hour: 10,
      date: "2024-10-17",
      availableSlot: 1,
      time_display: "11:00 - 11:59",
    },
  ],
};

export const getTimesSlotsErrorResponse = {
  status: "FAIL",
  data: [""],
  slot_dates: [],
  slot_times: [],
  message: ["Something wrong..."],
};

export const getPaymentUrlSuccessResponse = {
  status: "OK",
  url: "https://securepay.sslcommerz.com/gwprocess/v4/gw.php?Q=REDIRECT&SESSIONKEY=29A6DB7914F4B36DA6893D93EE24F6EC&cardname=",
  order_id: "SBIMU1737554426283",
  token_no: "T2U6790F9FACCEF079146",
};
