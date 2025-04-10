import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { serverService } from "./server.service";
import { applicationService } from "../applications/applications.service";
import ApiError from "../../errorHandelars/ApiError";
import { IApplication } from "../applications/applications.interface";

const proxyInfo = {
  protocol: "http",
  host: "103.174.51.75",
  port: 7771,
  auth: {
    username: "ithub1",
    password: "it-hub",
  },
};

// const proxyInfo = {
//   protocol: "http",
//   host: "103.104.143.145",
//   port: 8927,
//   auth: {
//     username: "user272565",
//     password: "uw7eg9",
//   },
// };

const createNewSession = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
  // sendResponse(res, {
  //   statusCode: 500,
  //   success: true,
  //   message: `Session Created Successfully!`,
  //   data: {
  //     message: "User logged in!",
  //     csrfToken: "",
  //     userLogin: true,
  //   },
  // });

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;

  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.createNewSession(
    proxyUrl,
    cookiesData ?? [],
    id
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    const { csrfToken, userImg, redirectPath, requestPath } = response;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Session Created Successfully!`,
      data: {
        message: userImg ? "User logged in!" : "User not logged in!",
        csrfToken: csrfToken ?? null,
        userLogin: userImg ? true : false,
        requestPath,
        redirectPath,
      },
    });
  }
});

const mobileVerify = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.mobileVerify(
    proxyUrl,
    cookiesData ?? [],
    application
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    await serverService.authVerify(
      proxyUrl,
      response?.cookies ?? [],
      application
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const authVerify = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.authVerify(
    proxyUrl,
    cookiesData ?? [],
    application
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const verifyLoginOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;
  const otp = req?.body?.otp;

  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.vefiryLoginOTP(
    proxyUrl,
    cookiesData ?? [],
    application,
    otp
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    await serverService.createNewSession(
      proxyUrl,
      response?.cookies ?? [],
      application?._id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const applicationInfoSubmit = catchAsync(
  async (req: Request, res: Response): Promise<any> => {
    const id = req?.body?.id;

    const application = await applicationService.getOne(id);

    if (!application?._id || application?.status) {
      throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
    }

    const serverInfo = application?.serverInfo;
    const cookiesData = serverInfo?.cookies;
    const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

    const response = await serverService.applicationInfoSubmit(
      proxyUrl,
      cookiesData ?? [],
      application
    );

    if (response?.success === false) {
      sendResponse(res, {
        statusCode: response?.statusCode || 500,
        success: response?.success || false,
        message: response?.message,
        data: response?.data,
      });
    } else {
      const personalInfoResponse = await serverService.personalInfoSubmit(
        proxyUrl,
        response?.cookies ?? [],
        application
      );

      if (personalInfoResponse?.success === true) {
        const overviewInfoResponse = await serverService.overviewInfoSubmit(
          proxyUrl,
          personalInfoResponse?.cookies ?? [],
          application
        );

        if (overviewInfoResponse?.success === true) {
          await serverService.sendPaymentOTP(
            proxyUrl,
            overviewInfoResponse?.cookies ?? [],
            application,
            0
          );
        }
      }

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: response?.message,
        data: response?.data,
      });
    }
  }
);

const personalInfoSubmit = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.personalInfoSubmit(
    proxyUrl,
    cookiesData ?? [],
    application
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const overviewInfoSubmit = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.overviewInfoSubmit(
    proxyUrl,
    cookiesData ?? [],
    application
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const loggedOut = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.loggedOut(id);

  sendResponse(res, {
    statusCode: response?.status as number,
    success: response?.success as boolean,
    message: response?.message,
    data: {
      message: response?.userImg ? "User logged out!" : "User not logged out!",
      csrfToken: "",
      user: null,
    },
  });
});

const sendPaymentOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;

  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const resend = application?.resend ?? 0;
  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.sendPaymentOTP(
    proxyUrl,
    cookiesData ?? [],
    application,
    resend
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const verifyPaymentOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;
  const otp = req?.body?.otp;

  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.verifyPaymentOTP(
    proxyUrl,
    cookiesData ?? [],
    application,
    otp
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data?.res,
    });
  } else {
    const getTimeResponse = await serverService.paySlotTime(
      proxyUrl,
      response?.cookies ?? [],
      { ...application, slot_dates: response?.data?.slot_dates }
    );

    if (getTimeResponse?.success === true) {
      const captchaToken = await serverService?.getCaptchaToken(application);
      if (captchaToken?.length > 200) {
        await serverService.bookNow(
          proxyUrl,
          getTimeResponse?.cookies ?? [],
          {
            ...application,
            slot_dates: response?.data?.slot_dates,
            slot_time: response?.data?.slot_time,
          },
          captchaToken
        );
      }
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const getSlotTime = catchAsync(async (req: Request, res: Response) => {
  const id = req?.body?.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.paySlotTime(
    proxyUrl,
    cookiesData ?? [],
    application
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    if (response?.success === true) {
      const captchaToken = await serverService?.getCaptchaToken(application);
      if (captchaToken?.length > 200) {
        await serverService.bookNow(
          proxyUrl,
          response?.cookies ?? [],
          { ...application, slot_time: response?.data?.slot_time },
          captchaToken
        );
      }
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const bookNow = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

  const response = await serverService.bookNow(
    proxyUrl,
    cookiesData,
    application,
    application?.hash_params
  );

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: response?.data,
    });
  }
});

const getCaptchaToken = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.getCaptchaToken(application);
  const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;
  if (response?.length > 200) {
    await serverService?.bookNow(
      proxyUrl,
      application?.serverInfo?.cookies ?? [],
      application,
      response
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recaptcha Created Successfully!",
    data: response,
  });
});

export const serverController = {
  createNewSession,
  mobileVerify,
  authVerify,
  applicationInfoSubmit,
  personalInfoSubmit,
  overviewInfoSubmit,
  verifyLoginOTP,
  loggedOut,
  sendPaymentOTP,
  verifyPaymentOTP,
  getSlotTime,
  bookNow,
  getCaptchaToken,
};
