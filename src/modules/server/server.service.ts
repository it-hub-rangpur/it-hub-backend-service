import makeRequest from "./utils/makeRequest";
import { getLocationPathname, getSessionCSRFToken } from "./utils/helpers";
import { IApplication } from "../applications/applications.interface";
import {
  getAuthVerifyPayload,
  getOtpVerifyPayload,
  mobileVerifyPayload,
} from "./utils/appPayload";
import { applicationService } from "../applications/applications.service";
import httpStatus from "http-status";

const proxyInfo = {
  protocol: "http",
  host: "103.104.143.145",
  port: 8927,
  auth: {
    username: "user272565",
    password: "uw7eg9",
  },
};

const createNewSession = async (cookieinfo: string[]) => {
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "GET",
    path: "/",
    uri: proxyUrl,
    cookies: cookieinfo,
  };

  const serverResponse = await makeRequest(reqInfo);
  const cookies = serverResponse.headers.getSetCookie();
  const htmlContent = await serverResponse?.text();
  const { csrfToken, userImg } = getSessionCSRFToken(htmlContent);

  return {
    csrfToken,
    userImg,
    cookies,
  };
};

const sendLoginOTP = async (application: IApplication) => {
  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const vefiryPayload = mobileVerifyPayload(application, csrfToken) as {
    mobile_no: string;
    _token: string;
  };

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/mobile-verify",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: vefiryPayload,
  };

  const mobileVerifyResponse = await makeRequest(reqInfo);
  const status = mobileVerifyResponse?.status;
  const cookies = mobileVerifyResponse?.headers.getSetCookie();

  if (status === 302) {
    const location = mobileVerifyResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);

    if (path === "/login-auth") {
      console.log("mobile verify successfully");
      const authPayload = getAuthVerifyPayload(application, csrfToken);
      const reqInfo = {
        method: "POST",
        path: "/login-auth-submit",
        uri: proxyUrl,
        cookies: cookies,
        data: authPayload,
      };
      const authVefityResponse = await makeRequest(reqInfo);
      const status = authVefityResponse?.status;

      if (status === 302) {
        const location = authVefityResponse?.headers.get("Location");
        const path = getLocationPathname(location as string);
        if (path === "/login-otp") {
          console.log("auth verify successfully");
          const cookieinfo = authVefityResponse?.headers.getSetCookie();
          return {
            status,
            success: true,
            path,
            message: "Login OTP Sent Successfully",
            cookies: cookieinfo,
          };
        } else {
          return {
            status,
            success: false,
            path,
            message: "Password Verification Failed or Session Expired",
          };
        }
      }
    } else {
      return {
        status,
        success: false,
        path,
        message: "Mobile Verification Failed or Session Expired",
      };
    }
  }
};

const vefiryLoginOTP = async (application: IApplication, otp: string) => {
  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const vefiryPayload = getOtpVerifyPayload(otp, csrfToken);

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/login-otp-submit",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: vefiryPayload,
  };

  const otpVerifyResponse = await makeRequest(reqInfo);

  const status = otpVerifyResponse?.status;
  const cookiesInfo = otpVerifyResponse?.headers.getSetCookie();

  if (status === 302) {
    const location = otpVerifyResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);
    if (path === "/") {
      console.log("OTP verify successfully");
      const sessionResponse = await createNewSession(cookiesInfo as string[]);
      const { cookies, csrfToken, userImg } = sessionResponse;
      if (userImg) {
        console.log("Login Successfully");
        return {
          status,
          success: true,
          message: "Login Successfully",
          path,
          userImg,
          cookies,
          csrfToken,
        };
      } else {
        console.log("Session Not Found! Please create new session");
        return {
          status,
          success: true,
          message: "Session Not Found! Please create new session",
          path,
          cookies,
          csrfToken,
        };
      }
    } else {
      return {
        status,
        success: false,
        path,
        message: "OTP Verification Failed or Session Expired",
      };
    }
  }
};

const loggedOut = async (id: string) => {
  const response = await applicationService.updateByPhone(id, {
    serverInfo: {
      csrfToken: "",
      cookies: [],
    },
  });

  if (response?._id) {
    return {
      status: httpStatus.OK,
      success: true,
      message: "Logout Successfully",
      path: "/",
      userImg: "",
    };
  }
};

export const serverService = {
  createNewSession,
  sendLoginOTP,
  vefiryLoginOTP,
  loggedOut,
};
