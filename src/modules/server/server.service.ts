import makeRequest, { retryCodes } from "./utils/makeRequest";
import { getLocationPathname, getSessionCSRFToken } from "./utils/helpers";
import { IApplication } from "../applications/applications.interface";
import {
  getApplicationInfoSubmitPayload,
  getAuthVerifyPayload,
  getBookSlotPayload,
  getOtpVerifyPayload,
  getOverviewInfoSubmitPayload,
  getPayOtpSendPayload,
  getPayOtpVerifyPayload,
  getPersonalInfoSubmitPayload,
  getTimeSlotPayload,
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

const createNewSession = async (
  proxyUrl: string,
  cookieinfo: string[],
  id: string
) => {
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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
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

  await applicationService.updateByPhone(id, {
    serverInfo: {
      action: userImg ? "application-info" : "mobile-verify",
      csrfToken,
      cookies,
    },
  });

  socketIo.emit("server-action", {
    id,
    data: {
      success: true,
      action: userImg ? "application-info" : "mobile-verify",
    },
  });

  return {
    csrfToken,
    userImg,
    cookies,
    requestPath: reqInfo.path,
    redirectPath: "/",
  };
};

const mobileVerify = async (
  proxyUrl: string,
  cookieinfo: string[],
  application: IApplication
) => {
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const vefiryPayload = mobileVerifyPayload(application, csrfToken);

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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
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
          action: "password-verify",
          cookies,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "password-verify",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "Mobile number verified!",
        cookies,
        data: {
          success: true,
          requestPath: reqInfo.path,
          redirectPath: path,
        },
      };
    } else {
      return {
        success: false,
        statusCode: status,
        data: {
          success: false,
          requestPath: reqInfo.path,
          redirectPath: path,
        },
      };
    }
  }
};

const authVerify = async (
  proxyUrl: string,
  cookieInfo: string[],
  application: IApplication
) => {
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const authPayload = getAuthVerifyPayload(application, csrfToken);

  const reqInfo = {
    method: "POST",
    path: "/login-auth-submit",
    uri: proxyUrl,
    cookies: cookieInfo,
    data: authPayload,
  };

  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Password verifying...",
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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }
  if (status === 302) {
    const location = authVefityResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);
    const cookies = authVefityResponse?.headers.getSetCookie();

    if (path === "/login-otp") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Password verified!",
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

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          action: "login-otp-verify",
          cookies,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "login-otp-verify",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login OTP Sent Successfully",
        cookies,
        data: {
          success: true,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
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
        success: false,
        statusCode: httpStatus.OK,
        message: "Authentication Failed! | Password did not match!",
        data: {
          success: false,
          requestPath: reqInfo.path,
          redirectPath: path,
        },
      };
    }
  }
};

const vefiryLoginOTP = async (
  proxyUrl: string,
  cookieInfo: string[],
  application: IApplication,
  otp: string
) => {
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const vefiryPayload = getOtpVerifyPayload(otp, csrfToken);

  const reqInfo = {
    method: "POST",
    path: "/login-otp-submit",
    uri: proxyUrl,
    cookies: cookieInfo,
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

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    const cookiesInfo = otpVerifyResponse?.headers.getSetCookie();
    const location = otpVerifyResponse?.headers.get("Location");
    const path = getLocationPathname(location as string);

    if (path === "/") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "OTP verified!",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          action: "create-session",
          cookies: cookiesInfo,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "create-session",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified successfully",
        cookies: cookiesInfo,
        data: {
          success: true,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
      };
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
        statusCode: httpStatus.OK,
        message: "OTP Verification Failed!",
        data: {
          success: false,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
      };
    }
  }
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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
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
            action: `Status:${status} | All attempts failed.`,
            status: "Failed",
            color: "error",
          },
        });
        return {
          success: false,
          statusCode: status,
          message: `Error | Status:${status} | All attempts failed.`,
          data: {
            success: false,
            reqPath: reqInfo.path,
            redirectPath: null,
          },
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

// const vefiryLoginOTP = async ( application: IApplication, otp: string) => {
//   const cookieinfo = application?.serverInfo?.cookies ?? [];
//   const csrfToken = application?.serverInfo?.csrfToken ?? "";
//   const vefiryPayload = getOtpVerifyPayload(otp, csrfToken);

//   const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

//   const reqInfo = {
//     method: "POST",
//     path: "/login-otp-submit",
//     uri: proxyUrl,
//     cookies: cookieinfo,
//     data: vefiryPayload,
//   };

//   socketIo.emit("server-logs", {
//     id: application?._id,
//     log: {
//       action: "Verifying OTP...",
//       status: "Pending",
//       color: "error",
//     },
//   });

//   const otpVerifyResponse = await makeRequest(
//     reqInfo,
//     application?._id as string
//   );

//   const status = otpVerifyResponse?.status;
//   const cookiesInfo = otpVerifyResponse?.headers.getSetCookie();

//   if (retryCodes.includes(status)) {
//     socketIo.emit("server-logs", {
//       id: application?._id,
//       log: {
//         action: `Error | Status:${status} | All attempts failed.`,
//         status: "Failed",
//         color: "error",
//       },
//     });
//     return {
//       success: false,
//       statusCode: status,
//       path: reqInfo?.path,
//       data: null,
//     };
//   }

//   if (status === 302) {
//     const location = otpVerifyResponse?.headers.get("Location");
//     const path = getLocationPathname(location as string);
//     if (path === "/") {
//       socketIo.emit("server-logs", {
//         id: application?._id,
//         log: {
//           action: "OTP verified! | Creating new session...",
//           status: "Pending",
//           color: "error",
//         },
//       });
//       console.log("OTP verify successfully");
//       const sessionResponse = await createNewSession(
//         cookiesInfo as string[],
//         application?._id as string
//       );
//       const { cookies, csrfToken, userImg } = sessionResponse;
//       if (userImg) {
//         socketIo.emit("server-logs", {
//           id: application?._id,
//           log: {
//             action: "Session created! | User logged in successfully",
//             status: "Success",
//             color: "success",
//           },
//         });

//         console.log("Login Successfully");
//         return {
//           status,
//           success: true,
//           message: "Login Successfully",
//           path,
//           userImg,
//           cookies,
//           csrfToken,
//         };
//       } else {
//         console.log("Session Not Found! Please create new session");
//         socketIo.emit("server-logs", {
//           id: application?._id,
//           log: {
//             action: "OTP did not match! or Session Not Found!",
//             status: "Success",
//             color: "success",
//           },
//         });

//         return {
//           status,
//           success: false,
//           message: "OTP did not match! or Session Not Found!",
//           path,
//           cookies,
//           csrfToken,
//         };
//       }
//     } else {
//       socketIo.emit("server-logs", {
//         id: application?._id,
//         log: {
//           action: "OTP Verification Failed!",
//           status: "Failed",
//           color: "error",
//         },
//       });
//       return {
//         success: false,
//         statusCode: status,
//         path: reqInfo?.path,
//         data: null,
//       };
//     }
//   }
// };

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

const applicationInfoSubmit = async (
  proxyUrl: string,
  cookieinfo: string[],
  application: IApplication
) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Application info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const appplicationInfoPayload = getApplicationInfoSubmitPayload(
    application,
    csrfToken
  );

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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    const cookie = applicationInfoResponse?.headers?.getSetCookie();
    const location = applicationInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);
    if (path === "/personal-info") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Application info submitted!",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          action: "personal-info",
          cookies: cookie,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "personal-info",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "Application info submitted!",
        cookies: cookie,
        data: {
          success: true,
          reqPath: reqInfo.path,
          redirectPath: path,
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
        success: false,
        statusCode: httpStatus.OK,
        message: "Failed to submit application info",
        data: {
          success: false,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
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
      success: false,
      statusCode: httpStatus.OK,
      message: "Failed to submit application info",
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: "",
      },
    };
  }
};

const personalInfoSubmit = async (
  proxyUrl: string,
  cookieinfo: string[],
  application: IApplication
) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Personal info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const personalInfoPayload = getPersonalInfoSubmitPayload(
    application,
    csrfToken
  );

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
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    const cookie = personalInfoResponse?.headers?.getSetCookie();
    const location = personalInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);

    if (path === "/overview") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Personal info submitted!",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          action: "overview-info",
          cookies: cookie,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "overview-info",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "Personal info submitted!",
        cookies: cookie,
        data: {
          success: true,
          reqPath: reqInfo.path,
          redirectPath: path,
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
        success: false,
        statusCode: httpStatus.OK,
        message: "Failed to submit personal info",
        data: {
          success: false,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
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
      success: false,
      statusCode: httpStatus.OK,
      message: "Failed to submit application info",
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: "",
      },
    };
  }
};

const overviewInfoSubmit = async (
  proxyUrl: string,
  cookieinfo: string[],
  application: IApplication
) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Overview info submitting...",
      status: "Pending",
      color: "error",
    },
  });

  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const overviewInfoPayload = getOverviewInfoSubmitPayload(csrfToken);

  const reqInfo = {
    method: "POST",
    path: "/overview-submit",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: overviewInfoPayload,
  };

  const overviewInfoResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = overviewInfoResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    const cookie = overviewInfoResponse?.headers?.getSetCookie();
    const location = overviewInfoResponse?.headers?.get("Location");

    const path = getLocationPathname(location as string);

    if (path === "/payment") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Overview info submitted!",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          ...application?.serverInfo,
          action: "payment-otp",
          cookies: cookie,
        },
      });

      socketIo.emit("server-action", {
        id: application?._id,
        data: {
          success: true,
          action: "payment-otp",
        },
      });

      return {
        success: true,
        statusCode: httpStatus.OK,
        message: "Overview info submitted!",
        cookies: cookie,
        data: {
          success: true,
          reqPath: reqInfo.path,
          redirectPath: path,
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
        success: false,
        statusCode: httpStatus.OK,
        message: "Failed to submit overview info",
        data: {
          success: false,
          reqPath: reqInfo.path,
          redirectPath: path,
        },
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
      success: false,
      statusCode: httpStatus.OK,
      message: "Failed to submit overview info",
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: "",
      },
    };
  }
};

const sendPaymentOTP = async (application: IApplication, resend: number) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Sending payment OTP...",
      status: "Pending",
      color: "error",
    },
  });

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const OtpSendPayload = getPayOtpSendPayload(resend, csrfToken);

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/pay-otp-sent",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: OtpSendPayload,
  };

  const otpSentResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = otpSentResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to send payment OTP",
        status: "Failed",
        color: "error",
      },
    });

    return {
      statusCode: 200,
      success: false,
      message: "Failed to send payment OTP",
      path: reqInfo?.path,
      data: null,
    };
  } else {
    const res = await otpSentResponse?.json();
    if (res?.success && res?.message === "Sms send successfully") {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Payment OTP sent",
          status: "Success",
          color: "success",
        },
      });
      return {
        statusCode: httpStatus.OK,
        success: true,
        path: reqInfo?.path,
        message: "Payment OTP sent",
        data: {
          success: true,
        },
      };
    } else {
      const message = res?.message;
      const errMessage = res?.message?.error;
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: errMessage
            ? errMessage
            : message ?? "Failed to send payment OTP",
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: errMessage
          ? errMessage
          : message ?? "Failed to send payment OTP",
        path: reqInfo?.path,
        data: null,
      };
    }
  }
};

const verifyPaymentOTP = async (application: IApplication, otp: string) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Verifying payment OTP...",
      status: "Pending",
      color: "error",
    },
  });

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const otpVerifyPayload = getPayOtpVerifyPayload(otp, csrfToken);

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/pay-otp-verify",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: otpVerifyPayload,
  };

  const otpVerifyResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = otpVerifyResponse?.status;
  const cookieInfo = otpVerifyResponse?.headers?.getSetCookie();

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to verify payment OTP",
        status: "Failed",
        color: "error",
      },
    });

    return {
      statusCode: 200,
      success: false,
      message: "Failed to send payment OTP",
      path: reqInfo?.path,
      data: null,
    };
  } else {
    const res = await otpVerifyResponse?.json();
    if (res?.success) {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Payment OTP verified",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          csrfToken: csrfToken as string,
          cookies: cookieInfo,
        },
      });

      return {
        statusCode: httpStatus.OK,
        success: true,
        path: reqInfo?.path,
        message: "Payment OTP verified",
        data: res,
      };
    } else {
      const message = res?.message;
      const errMessage = res?.message?.error;
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: errMessage
            ? errMessage
            : message ?? "Failed to send payment OTP",
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: errMessage
          ? errMessage
          : message ?? "Failed to send payment OTP",
        path: reqInfo?.path,
        data: null,
      };
    }
  }
};

const paySlotTime = async (application: IApplication) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Geting slot time...",
      status: "Pending",
      color: "error",
    },
  });

  const appointment_date = "2025-03-24";

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const timeSlotPayload = getTimeSlotPayload(appointment_date, csrfToken);

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/pay-slot-time",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: timeSlotPayload,
  };

  const getTimeResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = getTimeResponse?.status;
  const cookieInfo = getTimeResponse?.headers?.getSetCookie();

  console.log(getTimeResponse);

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }

  if (status === 302) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to Fetch slot time",
        status: "Failed",
        color: "error",
      },
    });

    return {
      statusCode: 200,
      success: false,
      message: "Failed to Fetch slot time",
      path: reqInfo?.path,
      data: null,
    };
  } else {
    const data = await getTimeResponse?.json();
    if (data?.success) {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Slot time fetched",
          status: "Success",
          color: "success",
        },
      });

      await applicationService.updateByPhone(application?._id as string, {
        serverInfo: {
          csrfToken: csrfToken as string,
          cookies: cookieInfo,
        },
      });
      return {
        statusCode: httpStatus.OK,
        success: true,
        path: reqInfo?.path,
        message: "Slot time fetched",
        data: data,
      };
    } else {
      const errMessage =
        typeof data?.message === "string"
          ? data?.message
          : data?.message?.error ?? "Filed to get slot time";
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: errMessage,
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: errMessage,
        path: reqInfo?.path,
        data: null,
      };
    }
  }
};

const bookNow = async (application: IApplication, hashParam: string) => {
  socketIo.emit("server-logs", {
    id: application?._id,
    log: {
      action: "Booking slot time...",
      status: "Pending",
      color: "error",
    },
  });

  const appointment_date = "2025-3-24";

  const cookieinfo = application?.serverInfo?.cookies ?? [];
  const csrfToken = application?.serverInfo?.csrfToken ?? "";
  const booknowPayload = getBookSlotPayload(
    application,
    appointment_date,
    hashParam,
    csrfToken
  );

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const reqInfo = {
    method: "POST",
    path: "/paynow",
    uri: proxyUrl,
    cookies: cookieinfo,
    data: booknowPayload,
  };

  const bookNowResponse = await makeRequest(
    reqInfo,
    application?._id as string
  );

  const status = bookNowResponse?.status;

  if (retryCodes.includes(status)) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: `Status:${status} | All attempts failed.`,
        status: "Failed",
        color: "error",
      },
    });
    return {
      success: false,
      statusCode: status,
      message: `Error | Status:${status} | All attempts failed.`,
      data: {
        success: false,
        reqPath: reqInfo.path,
        redirectPath: null,
      },
    };
  }
  if (status === 302) {
    socketIo.emit("server-logs", {
      id: application?._id,
      log: {
        action: "Failed to Booked Slot",
        status: "Failed",
        color: "error",
      },
    });

    return {
      statusCode: 200,
      success: false,
      message: "Failed to Booked Slot",
      path: reqInfo?.path,
      data: null,
    };
  } else {
    const data = await bookNowResponse?.json();
    if (data?.success) {
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: "Slot Booked Successfully",
          status: "Success",
          color: "success",
        },
      });
      return {
        statusCode: httpStatus.OK,
        success: true,
        path: reqInfo?.path,
        message: "Slot Booked Successfully",
        data: data,
      };
    } else {
      const errMessage =
        typeof data?.message === "string"
          ? data?.message
          : data?.message?.error ?? "Filed to Book slot";
      socketIo.emit("server-logs", {
        id: application?._id,
        log: {
          action: errMessage,
          status: "Failed",
          color: "error",
        },
      });
      return {
        statusCode: status,
        success: false,
        message: errMessage,
        path: reqInfo?.path,
        data: null,
      };
    }
  }
};

export const serverService = {
  createNewSession,
  mobileVerify,
  authVerify,
  sendLoginOTP,
  vefiryLoginOTP,
  loggedOut,
  applicationInfoSubmit,
  personalInfoSubmit,
  overviewInfoSubmit,
  sendPaymentOTP,
  verifyPaymentOTP,
  paySlotTime,
  bookNow,
};
