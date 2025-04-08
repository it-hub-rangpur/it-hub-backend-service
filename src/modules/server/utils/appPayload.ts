import { paymentOptions } from "../../../Constants/ApplicationsContans";
import { IApplication } from "../../applications/applications.interface";

export const mobileVerifyPayload = (item: IApplication, token: string) => {
  return {
    _token: token,
    mobile_no: item?.phone,
  };
};

export const getAuthVerifyPayload = (item: IApplication, token: string) => {
  return {
    _token: token,
    password: item?.password,
  };
};

export const getOtpVerifyPayload = (otp: string, token: string) => {
  return {
    _token: token,
    otp: otp,
  };
};

export const getApplicationInfoSubmitPayload = (
  item: IApplication,
  token: string
) => {
  return {
    _token: token,
    highcom: item?.center,
    ivac_id: item?.ivac,
    visa_type: item?.visaType,
    webfile_id: item?.info[0]?.web_id,
    webfile_id_repeat: item?.info[0]?.web_id,
    family_count: item?.info?.length - 1,
    visit_purpose: item?.visit_purpose,
  };
};

export const getPersonalInfoSubmitPayload = (
  item: IApplication,
  token: string
) => {
  const family1 = item?.info[0];

  const formattedData: { [key: string]: string } = {};

  if (item?.info?.length) {
    item?.info?.forEach((member, index) => {
      if (index > 0) {
        formattedData[`family[${index}][name]`] = member.name;
        formattedData[`family[${index}][webfile_no]`] = member.web_id;
        formattedData[`family[${index}][again_webfile_no]`] = member.web_id;
      }
    });
  }

  return {
    _token: token,
    full__name: family1?.name,
    email_name: item?.email,
    pho_ne: item?.phone,
    ...formattedData,
  };
};

export const getOverviewInfoSubmitPayload = (token: string) => {
  return {
    _token: token,
  };
};

export const getPayOtpSendPayload = (resend: number, token: string) => {
  return {
    _token: token,
    resend: resend,
  };
};

export const getPayOtpVerifyPayload = (otp: string, token: string) => {
  return {
    _token: token,
    otp: otp,
  };
};

export const getTimeSlotPayload = (date: string, token: string) => {
  return {
    _token: token,
    appointment_date: date,
  };
};

export const getBookSlotPayload = (
  item: IApplication,
  captchaToken: string,
  token: string
) => {
  const paymentOption = paymentOptions[item?.paymentMethod];
  return {
    _token: token,
    appointment_date: item?.slot_dates[0],
    appointment_time: item?.slot_time[0]?.hour ?? 10,
    hash_param: captchaToken,
    selected_payment: paymentOption,
  };
};
