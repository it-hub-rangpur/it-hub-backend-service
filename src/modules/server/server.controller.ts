import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";
import { serverService } from "./server.service";
import { applicationService } from "../applications/applications.service";
import ApiError from "../../errorHandelars/ApiError";

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
      message: `Session not created!`,
      data: {
        path: response?.path,
        status: false,
      },
    });
  } else {
    const { cookies, csrfToken, userImg } = response;

    if (csrfToken && cookies) {
      console.log("session created successfully");
      await applicationService.updateByPhone(id, {
        serverInfo: {
          csrfToken,
          cookies,
        },
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Session Created Successfully!`,
      data: {
        message: userImg ? "User logged in!" : "User not logged in!",
        csrfToken: csrfToken ?? null,
        user: userImg ?? null,
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

    const personalInfoResponse = await serverService.personalInfoSubmit({
      ...application,
      serverInfo: {
        ...application?.serverInfo,
        cookies: applicationResponse?.data?.cookies as string[],
      },
    });

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

      const overviewInfoResponse = await serverService.overviewInfoSubmit({
        ...application,
        serverInfo: {
          ...application?.serverInfo,
          cookies: personalInfoResponse?.data?.cookies as string[],
        },
      });

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

export const serverController = {
  verifyLoginOTP,
  sendLoginOTP,
  createNewSession,
  loggedOut,
  startProcess,
};
