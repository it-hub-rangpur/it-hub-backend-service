// const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const fs = require("fs");
const path = require("path");
const { fetch } = require("undici");

// const proxyInfo = {
//   protocol: "http",
//   host: "103.104.143.145",
//   port: 8927,
//   auth: {
//     username: "user272565",
//     password: "uw7eg9",
//   },
// };

const proxyInfo = {
  protocol: "http",
  host: "103.174.51.75",
  port: 7771,
  auth: {
    username: "ithub1",
    password: "it-hub",
  },
};

const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 10MB in bytes

const testSpeedWithProgress = async (url, proxyUrl) => {
  const start = Date.now();
  let downloadedBytes = 0;
  let lastLoggedPercentage = -1;

  const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
    agent,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Create a temp file path
  const tempFile = path.join(__dirname, "temp_speedtest_file");

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(tempFile);

    const reader = response.body.getReader();
    const processStream = ({ done, value }) => {
      if (done) {
        writer.end();
        const duration = (Date.now() - start) / 1000;
        fs.unlinkSync(tempFile); // Clean up
        process.stdout.write("\n"); // New line after progress
        resolve(duration);
        return;
      }

      downloadedBytes += value.length;
      writer.write(value);

      const percentage = Math.floor((downloadedBytes / FILE_SIZE_BYTES) * 100);

      // Only log when percentage changes
      if (percentage !== lastLoggedPercentage && percentage % 5 === 0) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Downloading: ${percentage}%`);
        lastLoggedPercentage = percentage;
      }

      reader.read().then(processStream).catch(reject);
    };

    reader.read().then(processStream).catch(reject);

    writer.on("error", reject);
  });
};

(async () => {
  try {
    const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;
    console.log(`Testing proxy: ${proxyUrl.replace(/:[^@]+@/, ":*****@")}`);

    // Warm-up connection
    console.log("Performing warm-up request...");
    await testSpeedWithProgress("https://example.com", proxyUrl);

    // Actual speed test
    console.log("\nStarting speed test...");
    const duration = await testSpeedWithProgress(TEST_FILE_URL, proxyUrl);

    // Calculate speed
    const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;

    console.log(`
      Speed Test Results:
      - File Size: 50 MB
      - Transfer Time: ${duration.toFixed(2)} seconds
      - Download Speed: ${speedMbps.toFixed(2)} Mbps
    `);
  } catch (error) {
    console.error("\nSpeed test failed:", error.message);
  }
})();
