import { JSDOM } from "jsdom";

export const getSessionCSRFToken = (htmlString: string) => {
  const csrfTokenRegex = /var csrf_token = "([^"]+)"/;
  const csrfTokenMatch = htmlString.match(csrfTokenRegex);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";

  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  const userImgElement = doc.querySelector("img.rounded-circle");
  const userImg = userImgElement ? userImgElement.getAttribute("src") : "";

  return {
    csrfToken,
    userImg,
  };
};

export const getLocationPathname = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.pathname ?? "/";
};
