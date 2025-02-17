import axios from "axios";
import { Request, Response } from "express";
import https from "https";

const manageQueue = async () => {
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

const baseUrl = "https://payment.ivacbd.com";
const apiManageQueue = async (req: Request, res: Response) => {
  const cookieString = req.headers.credentials;
  const body = req.body;

  const axiosConfig = {
    headers: {
      "x-requested-with": "XMLHttpRequest",
      accept: "application/json, text/plain, */*",
      "content-type": "application/x-www-form-urlencoded",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      connection: "keep-alive",
      "sec-ch-ua":
        '"Not A(Brand";v="99", "Google Chrome";v="120", "Chromium";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: cookieString,
      origin: baseUrl,
      referer: `${baseUrl}/`,
      "cache-control": "no-cache",
      pragma: "no-cache",
    },
    withCredentials: true,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: 60000,
    }),
  };

  const params = new URLSearchParams(body);

  const result = await axios.post(
    `${baseUrl}/queue-manage`,
    params.toString(),
    axiosConfig
  );

  return res.status(result.status).json(result.data);

  // const headers = {
  //   ...req.headers,
  //   "x-requested-with": "XMLHttpRequest",
  //   accept: "application/x-www-form-urlencoded;charset=UTF-8;",
  //   "content-type": "application/x-www-form-urlencoded;charset=UTF-8;",
  //   "user-agent":
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  //   "accept-language": "en-US,en;q=0.9",
  //   referer: "https://payment.ivacbd.com/",
  //   origin: "https://payment.ivacbd.com",
  //   "accept-encoding": "gzip, compress, deflate, br",
  //   cookie: cookieString,

  // const result = await axios.post(
  //   `${baseUrl}/queue-manage`,
  //   req.body,
  //   axiosConfig
  // );

  // // Add CORS headers to the response
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // // Return the API response
  // return res.status(result.status).json(result.data);

  // const headers = {
  //   ...req.headers,
  //   "x-requested-with": "XMLHttpRequest",
  // Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
  // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
  //   Cookie: cookieString,
  // };
  // delete headers["host"];
  // headers["host"] = "payment.ivacbd.com";
  // const result = await axios.post(`${baseUrl}/queue-manage`, body, {
  //   headers,
  //   httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
  // });
  // res.status(result.status).json(result.data);

  // const body = req?.body;
  // const axiosConfig = {
  //   headers: {
  //     "x-requested-with": "XMLHttpRequest",
  //     accept: "application/json, text/plain, */*",
  //     "content-type": "application/json",
  //     "user-agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  //     "accept-language": "en-US,en;q=0.9",
  //     "accept-encoding": "gzip, deflate, br",
  //     connection: "keep-alive",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     cookie: cookieString,
  //     origin: baseUrl,
  //     referer: baseUrl,
  //   },
  //   withCredentials: true,
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //     keepAlive: true,
  //   }),
  // };

  // const axiosConfig = {
  //   headers: {
  //     ...req.headers,
  //     "x-requested-with": "XMLHttpRequest",
  //     Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
  //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
  //     Cookie: cookieString,
  //   },
  //   withCredentials: true,
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //     keepAlive: true,
  //   }),
  // };

  // const result = await axios.post(`${baseUrl}/queue-manage`, body, axiosConfig);
  // return res.status(result.status).json(result.data);
};

const getTimeSlots = async () => {
  // return 200;
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
  // return 200;
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

const sendOtp = () => {};

export const visaApiService = {
  manageQueue,
  getTimeSlots,
  payInvoice,
  apiManageQueue,
};
