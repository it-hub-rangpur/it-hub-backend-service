import { Response } from "express";

import { fetch, ProxyAgent } from "undici";

const proxyInfo = {
  protocol: "http",
  host: "103.104.143.145",
  port: 8927,
  auth: {
    username: "user272565",
    password: "uw7eg9",
  },
};

const client = new ProxyAgent({
  uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
});

const targetUrl = "https://payment.ivacbd.com";
// const targetUrl = "https://cms.it-hub.agency";
// const targetUrl = "https://www.google.com";

const createNewSession = async (response: Response) => {
  const htmlResponse = await fetch(targetUrl, {
    dispatcher: client,
    method: "GET",
  });

  const resCookies = htmlResponse.headers.getSetCookie();
  console.log("cookie", resCookies);
  response.setHeader("Set-Cookie", resCookies);
  // if (resCookies) {
  //   const cookiesArray = Array.isArray(resCookies) ? resCookies : [resCookies];
  //   cookiesArray.forEach((cookie) => {
  //     response.setHeader("Set-Cookie", cookie);
  //   });
  // }

  const body = await htmlResponse.text();
  response.status(htmlResponse.status);
  response.send(body);
};

export const serverService = {
  createNewSession,
};
