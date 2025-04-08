// const fs = require("fs");
// const path = require("path");
// const { fetch, ProxyAgent, Headers } = require("undici");

// const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
// const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes

// // Proxy configuration

// const proxyInfo = {
//   protocol: "http",
//   host: "103.31.209.201",
//   port: 50100,
//   auth: {
//     username: "pkshohag240",
//     password: "UTKroTZ94x",
//   },
// };

// const proxyAgent = new ProxyAgent({
//   uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
//   // Optimized settings:
//   keepAliveTimeout: 10000, // Increased from 5000
//   keepAliveMaxTimeout: 300000, // 5 minutes
//   connections: 1000, // Reduced from 1000 (too high can cause overhead)
//   pipelining: 10, // Increased from 1 (for HTTP/1.1)
//   tls: {
//     rejectUnauthorized: false, // Only if you trust the proxy
//   },
//   connect: {
//     timeout: 5000, // Connection timeout
//     // These can help with TCP tuning:
//     keepAlive: true,
//     keepAliveInitialDelay: 1000,
//   },
//   allowH2: true,
// });

// const testSpeedWithProgress = async () => {
//   const start = Date.now();
//   let downloadedBytes = 0;
//   let lastLoggedPercentage = -1;

//   console.log(
//     `Testing proxy: ${`http://${proxyInfo.auth.username}:*****@${proxyInfo.host}:${proxyInfo.port}`}`
//   );

//   const headers = new Headers();
//   headers.set("accept-language", "en-US,en;q=0.9");
//   headers.set("accept-encoding", "gzip, deflate, br");
//   headers.set("connection", "keep-alive");
//   headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
//   headers.set(
//     "Content-Type",
//     "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
//   );

//   const response = await fetch(TEST_FILE_URL, {
//     dispatcher: proxyAgent,
//     method: "GET",
//     headers: headers,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   // Create a temp file path
//   const tempFile = path.join(__dirname, "temp_speedtest_file");

//   return new Promise((resolve, reject) => {
//     const writer = fs.createWriteStream(tempFile);

//     const reader = response.body.getReader();
//     const processStream = ({ done, value }) => {
//       if (done) {
//         writer.end();
//         const duration = (Date.now() - start) / 1000;
//         fs.unlinkSync(tempFile); // Clean up
//         process.stdout.write("\n"); // New line after progress
//         resolve(duration);
//         return;
//       }

//       downloadedBytes += value.length;
//       writer.write(value);

//       const percentage = Math.floor((downloadedBytes / FILE_SIZE_BYTES) * 100);

//       // Only log when percentage changes
//       if (percentage !== lastLoggedPercentage && percentage % 5 === 0) {
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(`Downloading: ${percentage}%`);
//         lastLoggedPercentage = percentage;
//       }

//       reader.read().then(processStream).catch(reject);
//     };

//     reader.read().then(processStream).catch(reject);

//     writer.on("error", reject);
//   });
// };

// const targetServer = async () => {
//   const maxRetries = 10;
//   let attempts = 0;
//   let response;
//   let success = false;

//   const headers = new Headers();
//   headers.set("accept-language", "en-US,en;q=0.9");
//   headers.set("accept-encoding", "gzip, deflate, br");
//   headers.set("connection", "keep-alive");
//   headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
//   headers.set(
//     "Content-Type",
//     "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
//   );

//   while (attempts < maxRetries && !success) {
//     const start = Date.now();
//     attempts += 1;

//     try {
//       response = await fetch("https://payment.ivacbd.com", {
//         dispatcher: proxyAgent,
//         method: "GET",
//         headers: headers,
//       });

//       const end = Date.now();
//       const responseTime = end - start;

//       const minutes = Math.floor(responseTime / 60000);
//       const seconds = Math.floor((responseTime % 60000) / 1000);
//       const milliseconds = responseTime % 1000;

//       console.log(`Response time: ${minutes}m ${seconds}s ${milliseconds}ms`);
//       console.log(`Response time: ${responseTime} ms`);
//       console.log(`Status code: ${response.status}`);

//       if (response.status === 504) {
//         console.log(`Attempt ${attempts}: Received status 504, retrying...`);
//       } else {
//         success = true;
//       }
//     } catch (error) {
//       console.error(`Attempt ${attempts}: Error fetching data:`, error);
//       if (attempts >= maxRetries) {
//         throw error;
//       }
//     }
//   }

//   if (!success) {
//     console.error("Failed to fetch data after maximum retries");
//   }
// };

// targetServer().then(() => {
//   testSpeedWithProgress()
//     .then((duration) => {
//       const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;
//       console.log(`
//       Speed Test Results:
//       - File Size: 50 MB
//       - Transfer Time: ${duration.toFixed(2)} seconds
//       - Download Speed: ${speedMbps.toFixed(2)} Mbps
//     `);
//     })
//     .catch((error) => {
//       console.error("\nSpeed test failed:", error.message);
//     });
// });

const fs = require("fs");
const path = require("path");
const { fetch, ProxyAgent, Headers } = require("undici");
const os = require("os");

const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes
const TARGET_URL = "https://payment.ivacbd.com";

// Proxy configuration
const proxyInfo = {
  protocol: "http",
  host: "103.31.209.201",
  port: 50100,
  auth: {
    username: "pkshohag240",
    password: "UTKroTZ94x",
  },
};

// ========================
// IMPROVED PROXY AGENT CONFIGURATION
// ========================
const proxyAgent = new ProxyAgent({
  uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,

  // Connection settings
  keepAlive: true,
  keepAliveTimeout: 30000, // 30 seconds
  maxKeepAliveTimeout: 60000, // 1 minute
  keepAliveMaxRequests: 100,

  // Pool settings
  connections: 10, // Conservative pool size to start

  // Timeout settings
  connectTimeout: 10000, // 10 seconds
  bodyTimeout: 30000, // 30 seconds
  headersTimeout: 15000, // 15 seconds

  // Retry settings
  maxRetries: 3,
  retryTimeout: 5000, // 5 seconds

  // TLS/SSL settings
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },

  // Protocol settings
  pipelining: 1, // Start with no pipelining
  allowH2: false, // Disable HTTP/2 initially
});

// Debugging events
proxyAgent
  .on("dns", () => console.log("DNS lookup started"))
  .on("connect", () => console.log("TCP connection established"))
  .on("connection", () => console.log("HTTP connection established"))
  .on("disconnect", (err) =>
    console.log("Connection closed", err?.message || "")
  )
  .on("error", (err) => console.log("Proxy agent error:", err.message));

// ========================
// IMPROVED HEADERS CONFIGURATION
// ========================
const getCommonHeaders = () => {
  return new Headers({
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  });
};

// ========================
// IMPROVED TARGET SERVER TEST
// ========================
const testTargetServer = async () => {
  const maxRetries = 5;
  let attempts = 0;
  let lastError = null;

  console.log(`\nTesting connection to target server: ${TARGET_URL}`);

  while (attempts < maxRetries) {
    attempts++;
    console.log(`\nAttempt ${attempts} of ${maxRetries}`);

    try {
      const start = Date.now();
      const response = await fetch(TARGET_URL, {
        // dispatcher: proxyAgent,
        method: "GET",
        headers: getCommonHeaders(),
        redirect: "manual", // Handle redirects manually
      });

      const responseTime = Date.now() - start;

      console.log(`Response status: ${response.status}`);
      console.log(`Response time: ${responseTime}ms`);

      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        console.log(`Redirect detected to: ${location}`);
        return {
          success: true,
          status: response.status,
          redirected: true,
          location,
        };
      }

      return {
        success: true,
        status: response.status,
        responseTime,
      };
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempts} failed:`, error.message);

      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    `Failed to connect after ${maxRetries} attempts. Last error: ${lastError?.message}`
  );
};

// ========================
// IMPROVED SPEED TEST
// ========================
const testSpeedWithProgress = async () => {
  const start = Date.now();
  let downloadedBytes = 0;
  let lastLoggedPercentage = -1;

  console.log(`\nStarting speed test: ${TEST_FILE_URL}`);

  try {
    // First make a HEAD request to check availability
    const headResponse = await fetch(TEST_FILE_URL, {
      dispatcher: proxyAgent,
      method: "HEAD",
      headers: getCommonHeaders(),
    });

    if (!headResponse.ok) {
      throw new Error(`HEAD request failed with status ${headResponse.status}`);
    }

    const contentLength = headResponse.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) !== FILE_SIZE_BYTES) {
      console.warn(
        `Warning: File size mismatch (expected ${FILE_SIZE_BYTES}, got ${contentLength})`
      );
    }

    // Now perform the actual download
    const response = await fetch(TEST_FILE_URL, {
      dispatcher: proxyAgent,
      method: "GET",
      headers: getCommonHeaders(),
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status ${response.status}`);
    }

    const tempFile = path.join(__dirname, "temp_speedtest_file");

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(tempFile);
      const reader = response.body.getReader();

      const processStream = ({ done, value }) => {
        if (done) {
          writer.end();
          const duration = (Date.now() - start) / 1000;
          fs.unlink(tempFile, () => {});
          process.stdout.write("\n");
          resolve(duration);
          return;
        }

        downloadedBytes += value.length;
        writer.write(value);

        const percentage = Math.floor(
          (downloadedBytes / FILE_SIZE_BYTES) * 100
        );
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
  } catch (error) {
    console.error("\nSpeed test failed:", error.message);
    throw error;
  }
};

// ========================
// MAIN EXECUTION
// ========================
(async () => {
  try {
    console.log("Starting proxy performance test...");

    // 1. First test the target server
    const targetResult = await testTargetServer();
    console.log("\nTarget server test result:", targetResult);

    // 2. Run speed test if target server was reachable
    if (targetResult.success) {
      console.log("\nStarting speed test...");
      const duration = await testSpeedWithProgress();
      const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;

      console.log(`
Speed Test Results:
- File Size: 50 MB
- Transfer Time: ${duration.toFixed(2)} seconds
- Download Speed: ${speedMbps.toFixed(2)} Mbps
`);
    }
  } catch (error) {
    console.error("\nTest failed:", error.message);

    // Additional debug information
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }

    process.exitCode = 1;
  } finally {
    console.log("\nTest sequence completed");
  }
})();
