import http from "http";
import app, { allowedOrigins } from "../app";
import { Server as SocketIOServer, Socket } from "socket.io";

interface User {
  _id: string;
  isActive?: boolean;
  socketId?: string;
}

const onlineUsers: { [key: string]: User } = {}; // Object to track online users

const AppServer = http.createServer(app);

const io = new SocketIOServer(AppServer, {
  cors: {
    origin: allowedOrigins, // Allow all origins
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
  transports: ["websocket"],
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
