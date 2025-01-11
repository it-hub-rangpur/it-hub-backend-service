import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { testServerDom } from "../../utils/DomApi";
import axios from "axios";

puppeteer.use(StealthPlugin());

const getAvailableDatetime = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.goto("https://payment.ivacbd.com/", {
      waitUntil: "domcontentloaded",
    });

    // Simulate human-like interactions
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 300);

    const bodyString = await page.evaluate(() => {
      return document.body.innerHTML;
    });

    const regex =
      /AVAILABLE ON (\d{2}\/\d{2}\/\d{4}) AT (\d{2}:\d{2} [APM]{2})/;

    let availableDate = "";
    let availableTime = "";

    const notish = bodyString.match(regex);
    if (notish) {
      const date = notish[1]; // 09/01/2025
      const time = notish[2]; // 06:00 PM

      availableDate = date;
      availableTime = time;
    }
    await browser.close();
    return {
      availableDate,
      availableTime,
    };
  } catch (error) {
    console.error("Error:", error);
    await browser.close();
    return JSON.stringify({ error: error });
  }
};

const cookies = ""; // Replace with actual cookies if needed

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://payment.ivacbd.com/",
  Origin: "https://payment.ivacbd.com",
  "Accept-Encoding": "gzip, compress, deflate, br",
  Cookie: cookies,
  // Include CSRF Token or any other necessary headers
  // 'X-CSRF-TOKEN': csrfToken,
};

const testServer = async () => {
  return [];
};

// Export the service
export const reportsService = {
  getAvailableDatetime,
  testServer,
};
