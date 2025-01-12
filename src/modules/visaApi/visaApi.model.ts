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
      {
        id: 142049,
        ivac_id: 17,
        visa_type: 13,
        hour: 10,
        date: "2024-10-17",
        availableSlot: 1,
        time_display: "12:00 - 01:59",
      },
    ],
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
