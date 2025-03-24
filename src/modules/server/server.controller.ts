import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { serverService } from "./server.service";
import { applicationService } from "../applications/applications.service";
import ApiError from "../../errorHandelars/ApiError";
import { reCaptchaService } from "../reCaptcha/reCaptcha.service";
import { socketIo } from "../../socket";

const createNewSession = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const serverInfo = application?.serverInfo;
  const cookiesData = serverInfo?.cookies;

  const response = await serverService.createNewSession(cookiesData ?? [], id);

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success || false,
      message: response?.message,
      data: response?.data,
    });
  } else {
    const { csrfToken, userImg } = response;

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Session Created Successfully!`,
      data: {
        message: userImg ? "User logged in!" : "User not logged in!",
        csrfToken: csrfToken ?? null,
        user: userImg ?? null,
        action: "create-session",
      },
    });
  }
});

const sendLoginOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.sendLoginOTP(application);

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: response?.success === false || false,
      message: `Failed to send OTP!`,
      data: {
        path: response?.path,
        status: false,
      },
    });
  } else {
    await applicationService.updateByPhone(id, {
      serverInfo: {
        csrfToken: application?.serverInfo?.csrfToken,
        cookies: response?.cookies as string[],
      },
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: {
        path: response?.path,
        status: response?.status,
      },
    });
  }
});

const verifyLoginOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const otp = req.body.otp;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.vefiryLoginOTP(application, otp);

  if (response?.success === false) {
    sendResponse(res, {
      statusCode: response?.statusCode || 500,
      success: true,
      message: response?.message,
      data: {
        path: response?.path,
        status: response?.status,
      },
    });
  } else {
    await applicationService.updateByPhone(id, {
      serverInfo: {
        csrfToken: response?.csrfToken as string,
        cookies: response?.cookies as string[],
      },
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: response?.message,
      data: {
        message: response?.userImg ? "User logged in!" : "User not logged in!",
        csrfToken: response?.csrfToken,
        user: response?.userImg ?? null,
      },
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

const startProcess = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const applicationResponse = await serverService.applicationInfoSubmit(
    application
  );

  if (applicationResponse?.success === false) {
    sendResponse(res, {
      statusCode: applicationResponse?.statusCode || 500,
      success: true,
      message: applicationResponse?.message,
      data: {
        path: applicationResponse?.path,
        status: applicationResponse?.statusCode,
      },
    });
  } else {
    await applicationService.updateByPhone(id, {
      serverInfo: {
        ...application?.serverInfo,
        cookies: applicationResponse?.data?.cookies as string[],
      },
    });

    const personalInfoResponse = await serverService.personalInfoSubmit(
      application,
      applicationResponse?.data?.cookies as string[]
    );

    if (personalInfoResponse?.success === false) {
      sendResponse(res, {
        statusCode: personalInfoResponse?.statusCode || 500,
        success: false,
        message: personalInfoResponse?.message,
        data: {
          path: personalInfoResponse?.path,
          status: personalInfoResponse?.statusCode,
        },
      });
    } else {
      await applicationService.updateByPhone(id, {
        serverInfo: {
          ...application?.serverInfo,
          cookies: personalInfoResponse?.data?.cookies as string[],
        },
      });

      const overviewInfoResponse = await serverService.overviewInfoSubmit(
        application,
        personalInfoResponse?.data?.cookies as string[]
      );

      if (overviewInfoResponse?.success === false) {
        sendResponse(res, {
          statusCode: overviewInfoResponse?.statusCode || 500,
          success: false,
          message: overviewInfoResponse?.message,
          data: {
            path: overviewInfoResponse?.path,
            status: overviewInfoResponse?.statusCode,
          },
        });
      } else {
        await applicationService.updateByPhone(id, {
          serverInfo: {
            ...application?.serverInfo,
            cookies: overviewInfoResponse?.data?.cookies as string[],
          },
        });

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: overviewInfoResponse?.message,
          data: {
            path: overviewInfoResponse?.path,
            status: overviewInfoResponse?.statusCode,
          },
        });
      }
    }
  }
});

const sendPaymentOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const resend = req.body.resend;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.sendPaymentOTP(application, resend);
  sendResponse(res, {
    statusCode: response?.statusCode as number,
    success: response?.success as boolean,
    message: response?.message,
    data: {
      ...response?.data,
      path: response?.path,
      status: response?.statusCode,
    },
  });
});

const verifyPaymentOTP = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const otp = req.body.otp;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.verifyPaymentOTP(application, otp);
  sendResponse(res, {
    statusCode: response?.statusCode as number,
    success: response?.success as boolean,
    message: response?.message,
    data: {
      ...response?.data,
      path: response?.path,
      status: response?.statusCode,
    },
  });
});

const getSlotTime = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.paySlotTime(application);
  sendResponse(res, {
    statusCode: response?.statusCode as number,
    success: response?.success as boolean,
    message: response?.message,
    data: {
      ...response?.data,
      path: response?.path,
      status: response?.statusCode,
    },
  });
});

const bookNow = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const hashParam = req.body.hashParam;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await serverService.bookNow(application, hashParam);
  sendResponse(res, {
    statusCode: response?.statusCode as number,
    success: response?.success as boolean,
    message: response?.message,
    data: {
      ...response?.data,
      path: response?.path,
      status: response?.statusCode,
    },
  });
});

const getCaptchaToken = catchAsync(async (req: Request, res: Response) => {
  const id = req.body.id;
  const application = await applicationService.getOne(id);

  if (!application?._id || application?.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const response = await reCaptchaService.getReCaptchaTokenByAnti();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recaptcha Created Successfully!",
    data: response,
  });
});

export const serverController = {
  verifyLoginOTP,
  sendLoginOTP,
  createNewSession,
  loggedOut,
  startProcess,
  sendPaymentOTP,
  verifyPaymentOTP,
  getSlotTime,
  bookNow,
  getCaptchaToken,
};
