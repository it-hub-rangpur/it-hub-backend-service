import http from "http";
import app, { allowedOrigins } from "../app";
import { Server as SocketIOServer, Socket } from "socket.io";

interface User {
  _id: string;
  isActive?: boolean;
  socketId?: string;
}

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

  socket.on("message", (message: string) => {
    console.log("Message from socket:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export const socketIo = io;

export default AppServer;
