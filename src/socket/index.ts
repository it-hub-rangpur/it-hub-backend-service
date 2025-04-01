import http from "http";
import app, { allowedOrigins } from "../app";
import { Server as SocketIOServer, Socket } from "socket.io";
import axios from "axios";

const AppServer = http.createServer(app);

const io = new SocketIOServer(AppServer, {
  cors: {
    origin: allowedOrigins, // Correct origin
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
  transports: ["websocket", "polling"], // Ensure fallback to polling
});

interface IOnlineClient {
  _id: string;
  name: string;
  isActive: boolean;
  socketId: string;
  lastSeen: Date;
}
[];

const onlineClients: IOnlineClient[] = [];

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);
  socket.on("user-online", ({ _id, name }) => {
    const existingClient = onlineClients.find((client) => client._id === _id);
    if (existingClient) {
      existingClient.isActive = true;
      existingClient.socketId = socket.id;
      existingClient.lastSeen = new Date();
    } else {
      onlineClients.push({
        _id,
        name,
        isActive: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });
    }
    io.emit("user-status-changed", { _id, name, isOnline: true });
  });

  socket.on("user-offline", (userId: string) => {
    const user = onlineClients.find((client) => client._id === userId);
    if (user) {
      user.isActive = false;
      user.lastSeen = new Date();
      io.emit("user-status-changed", { _id: userId, isOnline: false });
    }
  });

  socket.on("get-online-users", (callback) => {
    const activeUsers = onlineClients.filter((user) => user.isActive);
    callback(activeUsers);
  });

  socket.on("disconnect", () => {
    const userIndex = onlineClients.findIndex(
      (user) => user.socketId === socket.id
    );
    if (userIndex !== -1) {
      const user = onlineClients[userIndex];
      onlineClients.splice(userIndex, 1);
      io.emit("user-status-changed", { _id: user._id, isOnline: false });
      console.log("User disconnected:", socket.id);
    }
  });

  socket.on("otp-send", async ({ phone, isTesting }) => {
    io.emit("otp-received", { phone, isTesting });
    if (isTesting) {
      console.log("OTP sent to", phone);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const randomDelay = Math.floor(Math.random() * 4000) + 1000;
      setTimeout(() => {
        io.emit("pay-send-otp", { otp, form: "test", phone });
      }, randomDelay);
    }
  });

  socket.on("sendSlotDate", (data) => {
    io.emit("get-dates", data);
  });

  socket.on("sendSlotTime", (data) => {
    io.emit("get-times", data);
  });

  socket.on("create-captcha", async (data) => {
    io.emit("get-captcha-token", data);
  });

  socket.on("received-url", async (data) => {
    const { url, phone } = data;

    if (url.includes("https://www.google.com/recaptcha/")) {
      const captchaBody = await axios.get(url);
      const htmlString = captchaBody?.data;
      const tokenStart = htmlString.indexOf('value="') + 7;
      const tokenEnd = htmlString.indexOf('"', tokenStart);
      const token = htmlString.slice(tokenStart, tokenEnd);
      io.emit("captcha-solved", { token, phone });
    }
  });

  socket.on("captcha-neded", (data) => {
    io.emit("captcha-create", data);
  });

  socket.on("container-close", (data) => {
    io.emit("captcha-close", data);
  });
  socket.on("captcha-solved", (data) => {
    io.emit("captcha-received", data);
  });

  socket.on("dbblmobilebanking-auto-otp", (data) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const randomDelay = Math.floor(Math.random() * 4000) + 1000;
    setTimeout(() => {
      io.emit("dbblmobilebanking-otp", { otp, acc: data?.acc });
    }, randomDelay);
  });
});

export const socketIo = io;

export default AppServer;
