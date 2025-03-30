import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import fs from "fs";
import path from "path";
import { fetch, ProxyAgent } from "undici";
import sendResponse from "../../shared/SendResponse";
import httpStatus from "http-status";

const TEST_FILE_URL = "http://speedtest.tele2.net/50MB.zip";
const FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes

const testSpeedWithProgress = async (url: string, proxyUrl?: string) => {
  const start = Date.now();
  let downloadedBytes = 0;
  let lastLoggedPercentage = -1;

  const client = new ProxyAgent({
    uri: proxyUrl as string,
    keepAliveTimeout: 5000,
    keepAliveMaxTimeout: 1800000,
    connections: 1000,
    pipelining: 1,
  });

  const response = await fetch(url, {
    dispatcher: client,
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Create a temp file path
  const tempDir = path.join(__dirname, "..", "..", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempFile = path.join(tempDir, `temp_speedtest_${Date.now()}`);

  return new Promise<number>((resolve, reject) => {
    const writer = fs.createWriteStream(tempFile);
    const reader = response.body?.getReader();

    if (!reader) {
      return reject(new Error("Failed to get readable stream from response"));
    }

    const processStream = ({
      done,
      value,
    }: {
      done: boolean;
      value?: Uint8Array;
    }) => {
      if (done) {
        writer.end();
        const duration = (Date.now() - start) / 1000;
        // Clean up temp file
        fs.unlink(tempFile, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
        process.stdout.write("\n"); // New line after progress
        resolve(duration);
        return;
      }

      if (value) {
        downloadedBytes += value.length;
        writer.write(Buffer.from(value));

        const percentage = Math.floor(
          (downloadedBytes / FILE_SIZE_BYTES) * 100
        );

        // Only log when percentage changes
        if (percentage !== lastLoggedPercentage) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(`Downloading: ${percentage}%`);
          lastLoggedPercentage = percentage;
        }
      }

      reader.read().then(processStream).catch(reject);
    };

    reader.read().then(processStream).catch(reject);
    writer.on("error", reject);
  });
};

const speedTestController = catchAsync(async (req: Request, res: Response) => {
  const proxyInfo = {
    protocol: "http",
    host: "103.174.51.75",
    port: 7771,
    auth: {
      username: "ithub1",
      password: "it-hub",
    },
  };

  try {
    const proxyUrl = proxyInfo
      ? `${proxyInfo.protocol}://${proxyInfo.auth.username}:${proxyInfo.auth.password}@${proxyInfo.host}:${proxyInfo.port}`
      : undefined;

    console.log(
      `Testing proxy: ${
        proxyUrl ? proxyUrl.replace(/:[^@]+@/, ":*****@") : "No proxy"
      }`
    );

    // Warm-up connection
    console.log("Performing warm-up request...");
    const warmupDuration = await testSpeedWithProgress(
      "https://example.com",
      proxyUrl
    );
    console.log(`Warm-up successful (${warmupDuration.toFixed(2)}s)`);

    // Actual speed test
    console.log("\nStarting speed test...");
    const duration = await testSpeedWithProgress(TEST_FILE_URL, proxyUrl);

    // Calculate speed
    const speedMbps = (FILE_SIZE_BYTES * 8) / (1024 * 1024) / duration;
    const speedMBps = FILE_SIZE_BYTES / (1024 * 1024) / duration;

    const result = {
      fileSize: "50 MB",
      transferTime: `${duration.toFixed(2)} seconds`,
      downloadSpeedMbps: speedMbps.toFixed(2),
      downloadSpeedMBps: speedMBps.toFixed(2),
      status: "success",
    };

    console.log("\nSpeed test completed:", result);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Speed test completed",
      data: result,
    });
    // res.status(200).json(result);
  } catch (error) {
    console.error("\nSpeed test failed:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Speed test failed",
    });
  }
});

export const vpsController = {
  speedTestController,
};
