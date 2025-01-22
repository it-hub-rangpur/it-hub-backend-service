import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { visaApiService } from "./visaApi.service";
import {
  getPaymentUrlSuccessResponse,
  getTimesSlotsErrorResponse,
  getTimesSlotsSuccessResponse,
  getVerifyErrorResponse,
  getVerifySuccessDateNull,
  getVerifySuccessResponse,
  sendOtpSuccess,
  slotNotAvailable,
} from "./visaApi.model";

const manageQueue = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.manageQueue();
  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (result === 200) {
    if (req?.body?.action === "sendOtp") {
      res.status(200).json(sendOtpSuccess);
    } else {
      res.status(200).json(getVerifySuccessResponse);
    }
  } else if (result === 422) {
    if (req?.body?.action === "sendOtp") {
      res.status(200).json(slotNotAvailable);
    } else {
      res.status(200).json(getVerifyErrorResponse);
    }
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else if (result === 500) {
    if (req?.body?.action === "sendOtp") {
      res.status(502).json({ message: "Bad Gateway" });
    } else {
      res.status(200).json(getVerifySuccessResponse);
    }
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

const getTimeSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.getTimeSlots();
  await new Promise((resolve) => setTimeout(resolve, 500));
  // res.status(200).json(getVerifySuccessResponse);

  if (result === 200) {
    res.status(200).json(getTimesSlotsSuccessResponse);
  } else if (result === 422) {
    res.status(200).json(getTimesSlotsErrorResponse);
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

const payInvoice = catchAsync(async (req: Request, res: Response) => {
  const result = await visaApiService.payInvoice();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // res.status(200).json(getVerifySuccessResponse);

  if (result === 200) {
    res.status(200).json(getPaymentUrlSuccessResponse);
  } else if (result === 422) {
    res.status(200).json(slotNotAvailable);
  } else if (result === 502) {
    res.status(502).json({ message: "Bad Gateway" });
  } else {
    res.status(504).json({ message: "Gateway Timeout" });
  }
});

export const visaApiController = {
  manageQueue,
  getTimeSlots,
  payInvoice,
};

// const status = {
//   _token: "",
//   apiKey: "",
//   action: "sendOtp",
//   resend: 2,
//   hash_params: {
//     token:
//       "03AFcWeA5FMEwkHI2TnsTR6FobQ1VnfHM6WRG9GPMfZU_jQaG14o6TfK0FjEtP7J7mM7BZrnMaf-xrXyGW69cEYXBN_7B9bLYKTYqGJsSFht33wnBnFIG1wPUp0hrW32wKfjXK5IM3Fn_PI0E1F0ltje_9f0yBF8QemNqVBSls_bEFAoi09xsrxGXA8m5c3yBMbZhU3ISh-lWTp4uO8VqOei-bn2D1GL69VNO9s4bF2uAQUAOx4cC8Wtsd9nm7DfZCzZD9rqx0nuAnmjeCRjitd-5qkjxjjNzx4RsZLI7eApO96MIGJSFH43Ny_wT6ygC3cxwGTdfXDOFvy-09bv9QaEN-22O6TQN9bQYCb9-Gl5mSUt7cZUlPBdc47wBtRMQgiTQHQxX16Qfy0m-YlCuhySric6jR8fYXJSKV1cq-Je8XZ5wkBjU2JthFm9OaZ-NmzG7F-7YcEDzHwMql7mGj4Uj7wjaFvshmBMR0NKeXV61_-qi_4a-GGjC2t9ScLxAUg0ZGKPc26u4baFe-HThCPnsULnVz_bbElapB9fbUZg4ww7u139e7-6ZXW9F_FAXhb2mL_Qq4kTd5Y_hrBmlUbc5OrOurXG4Q4K53zBu8rqURIU_PgKo7sawoywWOpv-kA7zzeQIraSJR9q-1A7qeUGj7Asxwkvu8jAgWfZyzRqQbRKCY995wrgkFqDkrzmImZOItXARtgvlbSyEnpE0RHZNhLVuN389ptyENkVfVprXe3QamfeR5Dmq1Oa9aj0SUHNkYqsadoGVSh-FqEpEhCm4K-5A0t-D_8iPLEVo3xPKqlv9p3yRbg6VswTdE53F6XUQYZeYzZsBxL3BOK2KVc7DER6Hvg3kuN6epjFoLKJmY-pDvR709lsRM_REKcZC35w1Riq1QafMYxf7RlevOI3n-Oot9RGpcadZNcaHS9x-zFDqMqvmlRcw01kqmiOlJv8xX7_TfMFFVMtIH_IA-p-KTIR4jTzfvmJB5TQe3QJr81x7glNDsK6TemEHw7xBjCn-6eodAohl_uDhKrVxnBme11FhvlAAtuirKNpDfkklZfxCu4r-cifjch0NVqVKd1XFGnpKIMHVfwwt9U10kFCBCgKvPzmlSsMM76WtDGWF7yOiS9hY-5D-kU1gjfcpW4wJ862sLz-MUinv6pSi_4D-n3CWySyU76Ccp_2Tpc2x-zaHDKgtZvawY72oPtxT6BuCJPntg-l8viqP9x3Cjve3Qtv4vW6gbi84eureU5TKOG6iHu9fjmwG_TGbYj4B9lx4AOOoG-A4OYDb4ArR1LzoUL7JS8Ca7eCSe12qty0koIyH2ngfvFiF9CIIquz5yitLUNnu2JdcqmhWNf1IK7cmMHommw-NC-bK8eV01UqZyvcyE7ctMhC1XdmOIBmnlPDUzGzbTKIF9r9lboX-e3AEzSNLpiNAhalqQXEzx2cXh2HgmKLSYN3zh2vSuF6O9tLyJh_h_Vcl7S1e0gDHhu2SCLWyfh9g_K-GAZbc9EQLDqdjxj2-rwpc7GmsEhG34a0eEIowVcdWWbDfEfFLYSaGZCdvU-3tSlLTbq3PlB8TRKPdoO-GJrJVXxpBUllLnh9PEoX3lWVcO30wh2Lr2pXRBNvTYlZC7XiV9ORdzpf15kwGQDIti05QMaEix9-KPfw55XOTvSfWrz_LIk5BzBDi0qPrMayz8warJLmuDyh7KGhKwpzddyEhOO6LDBR4GajoR9_YwCsWTTsXhgbWrDx5D3xBpQcbM4nd37UocY6XExiRBDyXd4cPIRNfcsb2xhlEIKpRYQVh7wrINLg1nImrSoYWFrCi3gV90cs_enyp5-Ov2dglb2tg0b39HZ-1RmYVhJik0UgMxd0tUqBHEkggE_tk-uOVmdBTal2_UG_2xglMop4lr24WgpJDQr9kWO8PKRG6SIvubs2oXWuhCNDJvocmHTg9xoDmSNYWc23bK32a2uxzj3sBDa_UFWcgYeMht75Kt3BKXavw5Ht1LWbbD-FYo6goWxmLXtdkH8u4w7EA6HzhiWXqRBpe8y3GvgNQrymOqHblVs5LgkKw8wg5D8pv1VAeWdBA0YgVhSZNyl74wFPei90r2UgXm3qBoAbJhYrVyLQQxqSSQur8TeBsiuaIKRnqxCgwRKhCsQvf1wm4ptXXXCDADQR_d-4xDUiCupdc7YruQ1ht7_W4ZR3zvkPJLXcZLNx_xBlgOr_QGD2ShKqUtcnAQ1w0pZFHecoJ-NN6nVRLs",
//     message: "Solved",
//   },
//   selected_payment: {
//     name: "DBBL MOBILE BANKING",
//     slug: "dbblmobilebanking",
//     grand_total: 10.2912621,
//     link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/dbblmobilebank.png",
//   },
//   info: [
//     {
//       web_id: "BGDDV02C0625",
//       web_id_repeat: "BGDDV02C0625",
//       name: "DENO NATH",
//       phone: "01728159833",
//       email: "RIMONISLAM6677@GMAIL.COM",
//       amount: 800,
//       center: {
//         id: 1,
//         c_name: "Dhaka",
//         prefix: "D",
//         is_delete: 0,
//         is_open: true,
//       },
//       ivac: {
//         id: 17,
//         center_info_id: 1,
//         ivac_name: "IVAC, Dhaka (JFP)",
//         address: "Jamuna Future Park",
//         prefix: "D",
//         ceated_on: "2018-07-12 05:58:00",
//         visa_fee: 800,
//         is_delete: 0,
//         app_key: "IVACJFP",
//         contact_number: "",
//         charge: 3,
//         new_visa_fee: 800,
//         old_visa_fee: 800,
//         new_fees_applied_from: "2018-08-05 00:00:00",
//         notify_fees_from: "2018-07-29 04:54:32",
//         max_notification_count: 2,
//         allow_old_amount_until_new_date: 2,
//         notification_text_beside_amount:
//           "(From <from> this IVAC fees will be <new_amount> BDT)",
//       },
//       visa_type: {
//         id: 13,
//         type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//         order: 2,
//         is_active: 1,
//         $$hashKey: "object:50",
//       },
//       amountChangeData: {
//         allow_old_amount_until_new_date: 2,
//         max_notification_count: 0,
//         old_visa_fees: "800.00",
//         new_fees_applied_from: "2018-08-05 00:00:00",
//         notice: false,
//         notice_short: "",
//         notice_popup: "",
//         new_visa_fee: "800.00",
//       },
//       confirm_tos: true,
//       otp: "993033",
//     },
//   ],
//   createdAt: "2025-01-22T09:04:24.458Z",
//   otp: "993033",
//   slot_dates: ["2025-01-23"],
//   slot_times: [
//     {
//       id: 142049,
//       ivac_id: 17,
//       visa_type: 13,
//       hour: 10,
//       date: "2024-10-17",
//       availableSlot: 1,
//       time_display: "10:00 - 10:59",
//     },
//     {
//       id: 142049,
//       ivac_id: 17,
//       visa_type: 13,
//       hour: 10,
//       date: "2024-10-17",
//       availableSlot: 1,
//       time_display: "11:00 - 11:59",
//     },
//   ],
//   paymentStatus: {
//     status: "OK",
//     url: "https://securepay.sslcommerz.com/gwprocess/v4/gw.php?Q=REDIRECT&SESSIONKEY=29A6DB7914F4B36DA6893D93EE24F6EC&cardname=",
//     order_id: "SBIMU1737554426283",
//     token_no: "T2U6790F9FACCEF079146",
//   },
// };
