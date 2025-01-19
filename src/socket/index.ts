import http from "http";
import app, { allowedOrigins } from "../app";
import { Server as SocketIOServer, Socket } from "socket.io";
import { applicationService } from "../modules/applications/applications.service";
import axios from "axios";

interface User {
  _id: string;
  isActive?: boolean;
  socketId?: string;
}

const onlineUsers: { [key: string]: User } = {}; // Object to track online users

const AppServer = http.createServer(app);

const io = new SocketIOServer(AppServer, {
  cors: {
    origin: allowedOrigins, // Correct origin
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
  transports: ["websocket", "polling"], // Ensure fallback to polling
});

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);
  socket.on("user-online", (userId: string) => {
    onlineUsers[userId] = {
      _id: userId,
      isActive: true,
      socketId: socket.id,
    };
    io.emit("online", userId); // Notify everyone that the user is online
  });

  socket.on("otp-send", async ({ phone, isTesting }) => {
    if (isTesting) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const randomDelay = Math.floor(Math.random() * 4000) + 1000;
      setTimeout(() => {
        io.emit("otp-get", { otp, to: phone });
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
    console.log("captcha-neded:", data);
    io.emit("captcha-create", data);
  });

  socket.on("container-close", (data) => {
    io.emit("captcha-close", data);
  });
  socket.on("captcha-solved", (data) => {
    console.log(data);
    io.emit("captcha-received", data);
  });

  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        delete onlineUsers[userId];
        io.emit("offline", userId);
        console.log(`${userId} is offline.`);
        break;
      }
    }
  });
});

export const socketIo = io;

export default AppServer;
