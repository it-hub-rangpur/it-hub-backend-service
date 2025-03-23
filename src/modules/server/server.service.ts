import makeRequest, { retryCodes } from "./utils/makeRequest";
import { getLocationPathname, getSessionCSRFToken } from "./utils/helpers";
import { IApplication } from "../applications/applications.interface";
import {
  getApplicationInfoSubmitPayload,
  getAuthVerifyPayload,
  getOtpVerifyPayload,
  getOverviewInfoSubmitPayload,
  getPersonalInfoSubmitPayload,
  mobileVerifyPayload,
} from "./utils/appPayload";
import { applicationService } from "../applications/applications.service";
import httpStatus from "http-status";
import { socketIo } from "../../socket";

const proxyInfo = {
  protocol: "http",
  host: "103.104.143.145",
  port: 8927,
  auth: {
    username: "user272565",
    password: "uw7eg9",
  },
};

const createNewSession = async (cookieinfo: string[], id: string) => {
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "GET",
    path: "/",
    uri: proxyUrl,
    cookies: cookieinfo,
  };

  socketIo.emit("server-logs", {
    id,
    log: {
      action: "Creating or connecting to a new session",
      status: "Pending",
      color: "error",
    },
  });

  const serverResponse = await makeRequest(reqInfo, id);
  const status = serverResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  const cookies = serverResponse.headers.getSetCookie();
  const htmlContent = await serverResponse?.text();
  const { csrfToken, userImg } = getSessionCSRFToken(htmlContent);

  socketIo.emit("server-logs", {
    id,
    log: {
      action: `Session Created | ${
        userImg ? "User logged in!" : "User not logged in!"
      }`,
      status: "Success",
      color: "success",
    },
  });
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

  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Mobile number verifying...",
      status: "Pending",
      color: "error",
    },
  });

  const mobileVerifyResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );
  const status = mobileVerifyResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  if (status === 302) {
    const cookies = mobileVerifyResponse?.headers.getSetCookie();
    const location = mobileVerifyResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);

    if (path === "/login-auth") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Mobile number verified!",
          status: "Success",
          color: "success",
        },
      });
      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          cookies,
        },
      });

      const authPayload = getAuthVerifyPayload(application, csrfToken);
      const reqInfo = {
        method: "POST",
        path: "/login-auth-submit",
        uri: proxyUrl,
        cookies: cookies,
        data: authPayload,
      };

      console.log("mobile verify successfully");
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Authenticating...",
          status: "Pending",
          color: "error",
        },
      });
      const authVefityResponse = await makeRequest(
        reqInfo,
        application?._id as string
      );
      const status = authVefityResponse?.status;

      if (retryCodes.includes(status)) {
        socketIo.emit("server-logs", {
          id: application?._id,
          log: {
            action: `Error | Status:${status} | All attempts failed.`,
            status: "Failed",
            color: "error",
          },
        });
        return {
          success: false,
          statusCode: status,
          path: reqInfo?.path,
          data: null,
        };
      }

      if (status === 302) {
        const location = authVefityResponse?.headers.get("Location");
        const path = getLocationPathname(location as string);
        if (path === "/login-otp") {
          socketIo.emit("server-logs", {
            id: application?._id,
            log: {
              action: "Authenticated!",
              status: "Success",
              color: "success",
            },
          });
          socketIo.emit("server-logs", {
            id: application?._id,
            log: {
              action: "Login OTP Sent!",
              status: "Success",
              color: "success",
            },
          });
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
          socketIo.emit("server-logs", {
            id: application?._id,
            log: {
              action: "Authentication Failed! | Password did not match!",
              status: "Failed",
              color: "error",
            },
          });
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
        success: false,
        statusCode: status,
        path: "/mobile-verify",
        data: null,
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

  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Verifying OTP...",
      status: "Pending",
      color: "error",
    },
  });

  const otpVerifyResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = otpVerifyResponse?.status;
  const cookiesInfo = otpVerifyResponse?.headers.getSetCookie();

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  if (status === 302) {
    const location = otpVerifyResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);
    if (path === "/") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "OTP verified! | Creating new session...",
          status: "Pending",
          color: "error",
        },
      });
      console.log("OTP verify successfully");
      const sessionResponse = await createNewSession(
        cookiesInfo as string[],
        application?._id as string
      );
      const { cookies, csrfToken, userImg } = sessionResponse;
      if (userImg) {
        socketIo.emit("server-logs", {
          id: application?._id,
          log: {
            action: "Session created! | User logged in successfully",
            status: "Success",
            color: "success",
          },
        });

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
        socketIo.emit("server-logs", {
          id: application?._id,
          log: {
            action: "OTP did not match! or Session Not Found!",
            status: "Success",
            color: "success",
          },
        });

        return {
          status,
          success: false,
          message: "OTP did not match! or Session Not Found!",
          path,
          cookies,
          csrfToken,
        };
      }
    } else {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "OTP Verification Failed!",
          status: "Failed",
          color: "error",
        },
      });
      return {
        success: false,
        statusCode: status,
        path: reqInfo?.path,
        data: null,
      };
    }
  }
};

const loggedOut = async (id: string) => {
  socketIo.emit("server-logs", {
    id,
    log: {
      action: "User logging out!",
      status: "Pending",
      color: "error",
    },
  });
  const response = await applicationService.updateByPhone(id, {
    serverInfo: {
      csrfToken: "",
      cookies: [],
    },
  });

  if (response?._id) {
    socketIo.emit("server-logs", {
      id,
      log: {
        action: "User logged out successfully!",
        status: "Success",
        color: "success",
      },
    });
    return {
      status: httpStatus.OK,
      success: true,
      message: "Logout Successfully",
      path: "/verify-otp",
      userImg: "",
    };
  }
};

const applicationInfoSubmit = async (application: IApplication) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Application info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const appplicationInfoPayload = getApplicationInfoSubmitPayload(
    application,
    csrfToken
  );

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/application-info-submit",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: appplicationInfoPayload,
  };

  const applicationInfoResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = applicationInfoResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  if (status === 302) {
    const cookie = applicationInfoResponse?.headers?.get("set-cookie");
    const location = applicationInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);

    if (path === "/personal-info-submit") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Application info submitted! | try to submit personal info",
          status: "Success",
          color: "success",
        },
      });

      return {
        statusCode: httpStatus.OK,
        success: true,
        path: path,
        message: "Application info submitted! | try to submit personal info",
        data: {
          success: true,
          cookies: cookie,
        },
      };
    } else {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Failed to submit application info",
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: "Failed to submit application info",
        path: reqInfo?.path,
        data: null,
      };
    }
  } else {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to submit application info",
        status: "Failed",
        color: "error",
      },
    });
    return {
      statusCode: status,
      success: false,
      message: "Failed to submit application info",
      path: reqInfo?.path,
      data: null,
    };
  }
};

const personalInfoSubmit = async (application: IApplication) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Personal info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const personalInfoPayload = getPersonalInfoSubmitPayload(
    application,
    csrfToken
  );

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/personal-info-submit",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: personalInfoPayload,
  };

  const personalInfoResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = personalInfoResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  if (status === 302) {
    const cookie = personalInfoResponse?.headers?.get("set-cookie");
    const location = personalInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);

    if (path === "/overview-submit") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Personal info submitted! | try to submit overview info",
          status: "Success",
          color: "success",
        },
      });

      return {
        statusCode: httpStatus.OK,
        success: true,
        path: path,
        message: "Personal info submitted! | try to submit overview info",
        data: {
          success: true,
          cookies: cookie,
        },
      };
    } else {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Failed to submit personal info",
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: "Failed to submit personal info",
        path: reqInfo?.path,
        data: null,
      };
    }
  } else {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to submit personal info",
        status: "Failed",
        color: "error",
      },
    });
    return {
      statusCode: status,
      success: false,
      message: "Failed to submit personal info",
      path: reqInfo?.path,
      data: null,
    };
  }
};

const overviewInfoSubmit = async (application: IApplication) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Overview info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const overviewPayload = getOverviewInfoSubmitPayload(csrfToken);

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/overview-submit",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: overviewPayload,
  };

  const personalInfoResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = personalInfoResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Error | Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      path: reqInfo?.path,
      data: null,
    };
  }

  if (status === 302) {
    const cookie = personalInfoResponse?.headers?.get("set-cookie");
    const location = personalInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);

    if (path === "/payment") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Overview info submitted! | Payment session started",
          status: "Success",
          color: "success",
        },
      });

      return {
        statusCode: httpStatus.OK,
        success: true,
        path: path,
        message: "Overview info submitted! | Payment session started",
        data: {
          success: true,
          cookies: cookie,
        },
      };
    } else {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Failed to submit overview info",
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: "Failed to submit personal info",
        path: reqInfo?.path,
        data: null,
      };
    }
  } else {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to submit overview info",
        status: "Failed",
        color: "error",
      },
    });
    return {
      statusCode: status,
      success: false,
      message: "Failed to submit overview info",
      path: reqInfo?.path,
      data: null,
    };
  }
};

export const serverService = {
  createNewSession,
  sendLoginOTP,
  vefiryLoginOTP,
  loggedOut,
  applicationInfoSubmit,
  personalInfoSubmit,
  overviewInfoSubmit,
};
