// const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const fs = require("fs");
const path = require("path");
const { fetch } = require("undici");

const proxyInfo = {
  protocol: "http",
  host: "103.104.143.145",
  port: 8927,
  auth: {
    username: "user272565",
    password: "uw7eg9",
  },
};

const TEST_FILE_URL = "http://speedtest.tele2.net/10MB.zip";
const FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB in bytes

// const testSpeedWithProgress = async (url, proxyUrl) => {
//   const config = proxyUrl
//     ? {
//         // httpsAgent: new HttpsProxyAgent(proxyUrl),
//         responseType: "stream",
//       }
//     : { responseType: "stream" };

//   const start = Date.now();
//   let downloadedBytes = 0;
//   let lastLoggedPercentage = -1;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
//     },
//     // agent: new HttpsProxyAgent(proxyUrl),
//     responseType: "stream",
//   });
//   // const response = await axios.get(url, config);

//   // Create a temp file path
//   const tempFile = path.join(__dirname, "temp_speedtest_file");

//   return new Promise((resolve, reject) => {
//     const writer = fs.createWriteStream(tempFile);

//     response.data.on("data", (chunk) => {
//       downloadedBytes += chunk.length;
//       const percentage = Math.floor((downloadedBytes / FILE_SIZE_BYTES) * 100);

//       // Only log when percentage changes
//       if (percentage !== lastLoggedPercentage && percentage % 5 === 0) {
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(`Downloading: ${percentage}%`);
//         lastLoggedPercentage = percentage;
//       }
//     });

//     response.data.pipe(writer);

//     writer.on("finish", () => {
//       const duration = (Date.now() - start) / 1000;
//       fs.unlinkSync(tempFile); // Clean up
//       process.stdout.write("\n"); // New line after progress
//       resolve(duration);
//     });

//     writer.on("error", reject);
//   });
// };

const testSpeedWithProgress = async (url, proxyUrl) => {
  const options = {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
  };

  // Add proxy if provided
  if (proxyUrl) {
    options.agent = new HttpsProxyAgent(proxyUrl);
  }

  const start = Date.now();
  let downloadedBytes = 0;
  let lastLoggedPercentage = -1;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Create a temp file path
  const tempFile = path.join(__dirname, "temp_speedtest_file");
  const writer = fs.createWriteStream(tempFile);

  return new Promise((resolve, reject) => {
    response.body.on("data", (chunk) => {
      downloadedBytes += chunk.length;
      const percentage = Math.floor((downloadedBytes / FILE_SIZE_BYTES) * 100);

      // Only log when percentage changes
      if (percentage !== lastLoggedPercentage && percentage % 5 === 0) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Downloading: ${percentage}%`);
        lastLoggedPercentage = percentage;
      }
    });

    response.body.on("error", (err) => {
      reject(err);
    });

    response.body.pipe(writer);

    writer.on("finish", () => {
      const duration = (Date.now() - start) / 1000;
      fs.unlinkSync(tempFile); // Clean up
      process.stdout.write("\n"); // New line after progress
      resolve(duration);
    });

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
      - File Size: 10 MB
      - Transfer Time: ${duration.toFixed(2)} seconds
      - Download Speed: ${speedMbps.toFixed(2)} Mbps
    `);
  } catch (error) {
    console.error("\nSpeed test failed:", error.message);
  }
})();

// // File URL with known large size (e.g., 10MB test file)
// const TEST_FILE_URL = "http://speedtest.tele2.net/10MB.zip"; // Replace with actual large file
// const FILE_SIZE_MB = 10; // Size of test file in Megabytes

// const testSpeed = async (url, proxyUrl) => {
//   const config = proxyUrl
//     ? {
//         httpsAgent: new HttpsProxyAgent(proxyUrl),
//         responseType: "stream", // Stream response to measure speed
//       }
//     : {};

//   const start = Date.now();
//   const response = await axios.get(url, config);

//   // Ensure all data is downloaded
//   await new Promise((resolve) => {
//     response.data.on("end", resolve);
//     response.data.resume(); // Drain the stream
//   });

//   const durationSeconds = (Date.now() - start) / 1000;
//   return durationSeconds;
// };

// (async () => {
//   try {
//     const proxyUrl = `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`;

//     console.log(proxyUrl);

//     // Warm-up connection (optional)
//     await testSpeed("https://example.com", proxyUrl);

//     // Actual speed test
//     const duration = await testSpeed(TEST_FILE_URL, proxyUrl);

//     // Calculate Mbps (1 Byte = 8 bits)
//     const speedMbps = (FILE_SIZE_MB * 8) / duration;

//     console.log(`
//       Proxy Speed Test Results:
//       - File Size: ${FILE_SIZE_MB} MB
//       - Transfer Time: ${duration.toFixed(2)} seconds
//       - Speed: ${speedMbps.toFixed(2)} Mbps
//     `);
//   } catch (error) {
//     console.error("Speed test failed:", error.message);
//   }
// })();
