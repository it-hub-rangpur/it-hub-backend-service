import { fetch, Headers, ProxyAgent } from "undici";

const targetUrl = "https://payment.ivacbd.com";
// const targetUrl = "https://www.google.com";
// const targetUrl = "https://cms.it-hub.agency";

export interface IMakeRequest {
  method: string;
  path: string;
  uri: string;
  cookies: string[];
  data?: any;
}

const makeRequest = async (requestInfo: IMakeRequest) => {
  const client = new ProxyAgent({ uri: requestInfo.uri });
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

  // const xRequestCookie = requestInfo?.cookies[0]?.split(";")[0]?.split("=")[1];

  // if (requestCookie) {
  //   headers.set("Cookie", requestCookie.join("; "));
  // }

  headers.set("Cookie", requestCookie?.join("; "));

  // if (xRequestCookie) {
  //   headers.set("XMLHttpRequest", xRequestCookie);
  // }

  const htmlResponse = await fetch(targetUrl + requestInfo?.path, {
    dispatcher: client,
    method: requestInfo?.method,
    headers: headers,
    // body:
    //   requestInfo?.method !== "GET"
    //     ? new URLSearchParams(requestInfo?.data)
    //     : null,
    body:
      requestInfo?.method !== "GET" ? JSON.stringify(requestInfo?.data) : null,
    redirect: "manual",
  });
  // console.log(htmlResponse);
  return htmlResponse;
};

export default makeRequest;
