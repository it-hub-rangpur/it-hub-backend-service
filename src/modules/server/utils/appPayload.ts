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

// export const getApplicationInfoSubmitPayload = (item) => {
//   return {
//     _token: getCSRFToken(),
//     highcom: item?.center,
//     ivac_id: item?.ivac,
//     visa_type: item?.visaType,
//     webfile_id: item?.info[0]?.web_id,
//     webfile_id_repeat: item?.info[0]?.web_id,
//     family_count: item?.info?.length - 1,
//     visit_purpose: item?.visit_purpose,
//   };
// };

// export const getPersonalInfoSubmitPayload = (item) => {
//   const family1 = item?.info[0];

//   const formattedData = {};

//   if (item?.info?.length) {
//     item?.info?.forEach((member, index) => {
//       if (index > 0) {
//         formattedData[`family[${index}][name]`] = member.name;
//         formattedData[`family[${index}][webfile_no]`] = member.web_id;
//         formattedData[`family[${index}][again_webfile_no]`] = member.web_id;
//       }
//     });
//   }

//   return {
//     _token: getCSRFToken(),
//     full__name: family1?.name,
//     email_name: item?.email,
//     pho_ne: item?.phone,
//     ...formattedData,
//   };
// };

// export const getOverviewInfoSubmitPayload = (item) => {
//   return {
//     _token: getCSRFToken(),
//   };
// };

// export const getPayOtpSendPayload = (resend) => {
//   return {
//     _token: getCSRFToken(),
//     resend: resend,
//   };
// };

// export const getPayOtpVerifyPayload = (otp) => {
//   return {
//     _token: getCSRFToken(),
//     otp: otp,
//   };
// };

// export const getTimeSlotPayload = (date) => {
//   return {
//     _token: getCSRFToken(),
//     appointment_date: date,
//   };
// };

// export const getBookSlotPayload = (item) => {
//   return {
//     _token: getCSRFToken(),
//     appointment_date: item?.slot_dates[0],
//     appointment_time: 10,
//     hash_param: "hash_param",
//     "selected_payment[name]": item?.selected_payment?.name,
//     "selected_payment[slug]": item?.selected_payment?.slug,
//     "selected_payment[link]": item?.selected_payment?.link,
//   };
// };

// export const getSendOtpPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       is_open: true,
//       confirm_tos: true,
//       center: {
//         id: data?.center?.id,
//         c_name: data?.center?.c_name,
//         prefix: data?.center?.prefix,
//       },
//       ivac: {
//         id: data?.ivac?.id,
//         center_info_id: data?.ivac?.center_info_id,
//         ivac_name: data?.ivac?.ivac_name,
//         prefix: data?.ivac?.prefix,
//         app_key: data?.ivac?.app_key,
//       },
//       visa_type: {
//         id: data?.visa_type?.id,
//         type_name: data?.visa_type?.type_name,
//         is_active: data?.visa_type?.is_active,
//       },
//     };
//   });

//   return {
//     _token: localStorage.getItem("_token"),
//     apiKey: localStorage.getItem("apiKey"),
//     action: "sendOtp",
//     resend: item?.resend || 0,
//     info,
//   };
// };

// export const getVerifyOtpPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       otp: item?.otp,
//       is_open: true,
//       confirm_tos: true,
//       center: {
//         id: data?.center?.id,
//         c_name: data?.center?.c_name,
//         prefix: data?.center?.prefix,
//       },
//       ivac: {
//         id: data?.ivac?.id,
//         center_info_id: data?.ivac?.center_info_id,
//         ivac_name: data?.ivac?.ivac_name,
//         prefix: data?.ivac?.prefix,
//         app_key: data?.ivac?.app_key,
//       },
//       visa_type: {
//         id: data?.visa_type?.id,
//         type_name: data?.visa_type?.type_name,
//         is_active: data?.visa_type?.is_active,
//       },
//     };
//   });

//   return {
//     _token: localStorage.getItem("_token"),
//     apiKey: localStorage.getItem("apiKey"),
//     action: "verifyOtp",
//     otp: item?.otp,
//     info,
//   };
// };

// export const getSlotPayload = (item, date) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       otp: item?.otp,
//       is_open: true,
//       appointment_time: date,
//       confirm_tos: true,
//       // amountChangeData: data?.amountChangeData,
//       center: {
//         id: data?.center?.id,
//         c_name: data?.center?.c_name,
//         prefix: data?.center?.prefix,
//       },
//       ivac: {
//         id: data?.ivac?.id,
//         center_info_id: data?.ivac?.center_info_id,
//         ivac_name: data?.ivac?.ivac_name,
//         prefix: data?.ivac?.prefix,
//         app_key: data?.ivac?.app_key,
//       },
//       visa_type: {
//         id: data?.visa_type?.id,
//         type_name: data?.visa_type?.type_name,
//         is_active: data?.visa_type?.is_active,
//       },
//     };
//   });

//   const data = {
//     _token: localStorage.getItem("_token"),
//     apiKey: localStorage.getItem("apiKey"),
//     action: "generateSlotTime",
//     // amount: 10.0,
//     ivac_id: info[0]?.ivac?.id,
//     visa_type: info[0]?.visa_type?.id,
//     specific_date: date,
//     info,
//   };
//   return data;
// };

// export const getPayInvoicePayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       amount: 800.0,
//       is_open: true,
//       confirm_tos: true,
//       amountChangeData: data?.amountChangeData,
//       otp: item?.otp,
//       appointment_date: item?.specific_date,
//       appointment_time: item?.slot_time?.hour,
//       center: {
//         id: data?.center?.id,
//         c_name: data?.center?.c_name,
//         prefix: data?.center?.prefix,
//       },
//       ivac: {
//         id: data?.ivac?.id,
//         center_info_id: data?.ivac?.center_info_id,
//         ivac_name: data?.ivac?.ivac_name,
//         prefix: data?.ivac?.prefix,
//         app_key: data?.ivac?.app_key,
//       },
//       visa_type: {
//         id: data?.visa_type?.id,
//         type_name: data?.visa_type?.type_name,
//         is_active: data?.visa_type?.is_active,
//       },
//     };
//   });

//   const data = {
//     _token: localStorage.getItem("_token"),
//     apiKey: localStorage.getItem("apiKey"),
//     action: "payInvoice",
//     info,
//     selected_payment: {
//       ...item?.selected_payment,
//       grand_total: item?.info?.length * 824,
//     },
//     selected_slot: item?.slot_time ?? {},
//     hash_params: item?.hash_params,
//   };

//   return data;
// };

// export const getMobileVerifyPayload = (item) => {
//   return {
//     _token: getCSRFToken(),
//     mobile_no: item?.phone,
//   };
// };
