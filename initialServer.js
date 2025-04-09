// const { fetch, Agent, ProxyAgent } = require("undici");

// const targetDomain = "https://payment.ivacbd.com";

// // Proxy configuration
// const proxyInfo = {
//   host: "103.104.143.145",
//   port: 8927,
//   auth: {
//     username: "user272565",
//     password: "uw7eg9",
//   },
// };

// async function makeRequest() {
//   try {
//     const httpsAgent = new Agent({
//       keepAliveTimeout: 300000,
//       keepAliveMaxTimeout: 1800000,
//       connections: 1000,
//       pipelining: 1,
//     });

//     const proxyAgent = new ProxyAgent({
//       uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
//       keepAliveTimeout: 5000,
//       keepAliveMaxTimeout: 1800000,
//       connections: 1000,
//       pipelining: 1,
//     });

//     const headers = new Headers();
//     headers.set("accept-language", "en-US,en;q=0.9");
//     headers.set("accept-encoding", "gzip, deflate, br");
//     headers.set("connection", "keep-alive");
//     headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
//     headers.set(
//       "Content-Type",
//       "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
//     );

//     const response = await fetch(targetDomain, {
//       dispatcher: httpsAgent, // proxyAgent,
//       method: "GET",
//       headers: headers,
//     });

//     const status = response.status;
//     const responseReader = response.headers;
//     console.log("Status:", status);
//   } catch (error) {
//     console.error("Request failed:", error);
//   }
// }

// // Execute the request
// makeRequest();

// without warming..............
const fs = require("fs");
const path = require("path");
const { fetch, ProxyAgent, Headers } = require("undici");

const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes

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

const proxyAgent = new ProxyAgent({
  uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
  // Optimized settings:
  keepAliveTimeout: 10000, // Increased from 5000
  keepAliveMaxTimeout: 300000, // 5 minutes
  connections: 1000, // Reduced from 1000 (too high can cause overhead)
  pipelining: 10, // Increased from 1 (for HTTP/1.1)
  tls: {
    rejectUnauthorized: false, // Only if you trust the proxy
  },
  connect: {
    timeout: 5000, // Connection timeout
    // These can help with TCP tuning:
    keepAlive: true,
    keepAliveInitialDelay: 1000,
  },
  allowH2: true,
});

const testSpeedWithProgress = async () => {
  const start = Date.now();
  let downloadedBytes = 0;
  let lastLoggedPercentage = -1;

  console.log(
    `Testing proxy: ${`http://${proxyInfo.auth.username}:*****@${proxyInfo.host}:${proxyInfo.port}`}`
  );

  const headers = new Headers();
  headers.set("accept-language", "en-US,en;q=0.9");
  headers.set("accept-encoding", "gzip, deflate, br");
  headers.set("connection", "keep-alive");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
  );

  const response = await fetch(TEST_FILE_URL, {
    dispatcher: proxyAgent,
    method: "GET",
    headers: headers,
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

const targerServer = async () => {
  const start = Date.now();
  const headers = new Headers();
  headers.set("accept-language", "en-US,en;q=0.9");
  headers.set("accept-encoding", "gzip, deflate, br");
  headers.set("connection", "keep-alive");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
  );

  const response = await fetch("https://payment.ivacbd.com", {
    dispatcher: proxyAgent,
    method: "GET",
    headers: headers,
  });

  console.log(response?.status);
};

targerServer();
testSpeedWithProgress()
  .then((duration) => {
    const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;
    console.log(`
        Speed Test Results:
        - File Size: 50 MB
        - Transfer Time: ${duration.toFixed(2)} seconds
        - Download Speed: ${speedMbps.toFixed(2)} Mbps
      `);
  })
  .catch((error) => {
    console.error("\nSpeed test failed:", error.message);
  });

// with worming..........
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

// // Optimized ProxyAgent configuration
// const proxyAgent = new ProxyAgent({
//   uri: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
//   keepAliveTimeout: 30000, // 30 seconds
//   keepAliveMaxTimeout: 600000, // 10 minutes
//   connections: 50, // Optimal connection pool size
//   pipelining: 20, // More aggressive pipelining
//   tls: {
//     rejectUnauthorized: false, // Only if you trust the proxy
//     sessionTimeout: 60000, // Longer TLS session
//   },
//   connect: {
//     timeout: 10000, // 10 second connection timeout
//     keepAlive: true,
//     keepAliveInitialDelay: 500,
//     noDelay: true, // Disable Nagle's algorithm
//     windowSize: 65536, // Larger window size
//   },
//   allowH2: true, // Enable HTTP/2 if supported
//   retry: {
//     maxRetries: 3,
//     minTimeout: 1000,
//     maxTimeout: 5000,
//   },
// });

// // Common headers
// const headers = new Headers();
// headers.set("accept-language", "en-US,en;q=0.9");
// headers.set("accept-encoding", "gzip, deflate, br");
// headers.set("connection", "keep-alive");
// headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8;");
// headers.set(
//   "Content-Type",
//   "application/x-www-form-urlencoded;charset=UTF-8; application/json;"
// );

// async function warmupConnection() {
//   try {
//     console.log("Warming up connection...");
//     const start = Date.now();
//     await fetch(TEST_FILE_URL, {
//       dispatcher: proxyAgent,
//       method: "HEAD",
//       headers: headers,
//     });
//     console.log(`Warmup completed in ${(Date.now() - start) / 1000} seconds`);
//   } catch (error) {
//     console.log("Warmup request failed (may be normal):", error.message);
//   }
// }

// async function testSpeedWithProgress() {
//   const start = Date.now();
//   let downloadedBytes = 0;
//   let lastLoggedPercentage = -1;
//   const BUFFER_THRESHOLD = 2 * 1024 * 1024; // 2MB initial buffer

//   console.log(
//     `Testing proxy: http://${proxyInfo.auth.username}:*****@${proxyInfo.host}:${proxyInfo.port}`
//   );

//   // Warm up the connection first
//   await warmupConnection();

//   // Make the actual request
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
//     const initialBuffer = [];
//     let bufferSize = 0;
//     let isBuffering = true;

//     const processStream = async ({ done, value }) => {
//       if (done) {
//         // Write any remaining buffered data
//         if (initialBuffer.length > 0) {
//           writer.write(Buffer.concat(initialBuffer));
//         }
//         writer.end();
//         const duration = (Date.now() - start) / 1000;
//         fs.unlinkSync(tempFile); // Clean up
//         process.stdout.write("\n"); // New line after progress
//         resolve(duration);
//         return;
//       }

//       downloadedBytes += value.length;

//       if (isBuffering && bufferSize < BUFFER_THRESHOLD) {
//         // Buffer initial data to overcome slow start
//         initialBuffer.push(value);
//         bufferSize += value.length;
//         if (bufferSize >= BUFFER_THRESHOLD) {
//           isBuffering = false;
//           // Write all buffered data at once
//           writer.write(Buffer.concat(initialBuffer));
//           initialBuffer.length = 0; // Clear buffer
//         }
//       } else {
//         // Write directly to file after buffer is filled
//         writer.write(value);
//       }

//       const percentage = Math.floor((downloadedBytes / FILE_SIZE_BYTES) * 100);

//       // Update progress more frequently during initial phase
//       const updateFrequency = isBuffering ? 1 : 5;
//       if (
//         percentage !== lastLoggedPercentage &&
//         percentage % updateFrequency === 0
//       ) {
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(`Downloading: ${percentage}%`);
//         lastLoggedPercentage = percentage;
//       }

//       try {
//         const nextChunk = await reader.read();
//         processStream(nextChunk);
//       } catch (err) {
//         reject(err);
//       }
//     };

//     reader.read().then(processStream).catch(reject);
//     writer.on("error", reject);
//   });
// }

// // Run the test
// testSpeedWithProgress()
//   .then((duration) => {
//     const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;
//     console.log(`
//       Speed Test Results:
//       - File Size: 50 MB
//       - Transfer Time: ${duration.toFixed(2)} seconds
//       - Download Speed: ${speedMbps.toFixed(2)} Mbps
//     `);
//   })
//   .catch((error) => {
//     console.error("\nSpeed test failed:", error.message);
//   });

// const http = require("http");
// const httpProxy = require("http-proxy");
// const fs = require("fs");
// const path = require("path");
// const { fetch, Headers } = require("undici");

// const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
// const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes

// // Proxy configuration
// const proxyInfo = {
//   host: "103.104.143.145",
//   port: 8927,
//   auth: {
//     username: "user272565",
//     password: "uw7eg9",
//   },
// };

// // Create a proxy server
// const proxy = httpProxy.createProxyServer({
//   target: `http://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`,
//   changeOrigin: true,
//   xfwd: true,
// });

// // Create an HTTP server
// const server = http.createServer(async (req, res) => {
//   if (req.url === "/") {
//     try {
//       const duration = await testSpeedWithProgress();
//       const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;
//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.end(`
//         <h1>Speed Test Results</h1>
//         <p>File Size: 50 MB</p>
//         <p>Transfer Time: ${duration.toFixed(2)} seconds</p>
//         <p>Download Speed: ${speedMbps.toFixed(2)} Mbps</p>
//       `);
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "text/plain" });
//       res.end(`Speed test failed: ${error.message}`);
//     }
//   } else {
//     proxy.web(req, res);
//   }
// });

// const testSpeedWithProgress = async () => {
//   const start = Date.now();
//   let downloadedBytes = 0;
//   let lastLoggedPercentage = -1;

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

// // Start the server
// const PORT = 8000;
// server.listen(PORT, () => {
//   console.log(`Proxy server is running on http://localhost:${PORT}`);
// });
