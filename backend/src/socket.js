import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();
export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
export const getSocketId = (userId) => {
  return userSocketIds[userId];
};
const userSocketIds = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  userSocketIds[userId] = socket.id;
  socket.on("disconnect", () => {
    delete userSocketIds[userId];
    console.log("user disconnected");
  });
});
