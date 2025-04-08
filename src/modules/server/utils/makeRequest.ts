import { Headers, fetch, Agent, ProxyAgent } from "undici";
import { socketIo } from "../../../socket";
import ApiError from "../../../errorHandelars/ApiError";

export const retryCodes = [403, 500, 502, 504, 419];

const targetUrl = "https://payment.ivacbd.com";

export interface IMakeRequest {
  method: string;
  path: string;
  uri: string;
  cookies: string[];
  data?: any;
}

const makeRequest = async (
  requestInfo: IMakeRequest,
  _id: string,
  retries = 20
): Promise<any> => {
  const httpsAgent = new Agent({
    keepAliveTimeout: 300000,
    keepAliveMaxTimeout: 1800000,
    connections: 1000,
    pipelining: 1,
  });

  const client = new ProxyAgent({
    uri: requestInfo.uri,
    keepAliveTimeout: 5000,
    keepAliveMaxTimeout: 1800000,
    connections: 1000,
    pipelining: 1,
  });

  const headers = new Headers();
  headers.set("accept-language", "en-US,en;q=0.9");
  headers.set("accept-encoding", "gzip, deflate, br");
  headers.set("connection", "keep-alive");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
  );

  const requestCookie = requestInfo?.cookies?.map((cookie) => {
    const cookieName = cookie.split("=")[0];
    const cookieValue = cookie.split(";")[0]?.split("=")[1];
    return `${cookieName}=${cookieValue}`;
  });

  headers.set("Cookie", requestCookie?.join("; "));

  try {
    const htmlResponse = await fetch(targetUrl + requestInfo?.path, {
      dispatcher: httpsAgent,
      method: requestInfo?.method,
      headers: headers,
      body:
        requestInfo?.method !== "GET"
          ? JSON.stringify(requestInfo?.data)
          : null,
      redirect: "manual",
    });

    const status = htmlResponse.status;

    if (retryCodes.includes(status) && retries > 0) {
      socketIo.emit("server-logs", {
        id: _id,
        log: {
          action: `Status:${status} | Retrying...(${retries})`,
          status: "Error",
          color: "error",
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return makeRequest(requestInfo, _id, retries - 1);
    }
    return htmlResponse;
  } catch (error) {
    console.error("Error making request:", error);
    throw new ApiError(500, "Error making request");
  }
};

export default makeRequest;
