const generateBrowserHeaders = (request) => {
  const pathname = new URL(request.url).pathname;
  const generateReferer = () => {
    if (pathname === "/login-auth-submit") {
      return "https://payment.ivacbd.com/login-auth";
    } else if (pathname === "/login-otp-submit") {
      return "https://payment.ivacbd.com/login-otp";
    } else if (pathname === "/application-info-submit") {
      return "https://payment.ivacbd.com";
    } else if (pathname === "/personal-info-submit") {
      return "https://payment.ivacbd.com/personal-info";
    } else if (pathname === "/overview-submit") {
      return "https://payment.ivacbd.com/overview";
    } else {
      return "https://payment.ivacbd.com";
    }
  };

  const headers = new Headers(request.headers);
  headers.set("referer", generateReferer());
  headers.set("origin", "https://payment.ivacbd.com");
  headers.set("authority", "payment.ivacbd.com");

  return headers;
};

export default {
  async fetch(request) {
    const targetBaseUrl = "https://payment.ivacbd.com";
    try {
      const url = new URL(request.url);
      const endpoint = url.pathname;
      const targetUrl = `${targetBaseUrl}${endpoint}`;

      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: generateBrowserHeaders(request),
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? request.body
            : null,
        redirect: "manual",
      });

      // Forward the request to the target server
      const response = await fetch(newRequest);

      // Check if the response is OK
      if (!response.ok) {
        return new Response(`Error: ${response.statusText}`, {
          status: response.status,
        });
      }

      const redirectUrl = response.headers.get("location") || "";
      const data = await response.text();
      const cookies = response.headers.get("set-cookie") || "";

      const responseObject = {
        data,
        redirectUrl,
        cookies,
      };

      return new Response(JSON.stringify(responseObject), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Set-Cookie": cookies,
        },
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
