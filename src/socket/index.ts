import http from "http";
import app, { allowedOrigins } from "../app";
import { Server as SocketIOServer, Socket } from "socket.io";
import { applicationService } from "../modules/applications/applications.service";

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
    await applicationService.updateByPhone(phone, {
      resend: 1,
    });
  });

  socket.on("otp-verified", async ({ phone, otp }) => {
    await applicationService.updateByPhone(phone, {
      otp: otp,
    });
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
