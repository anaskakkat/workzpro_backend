import { Server } from "socket.io";
import colorize from "../utils/colorize";
import { Server as HTTPServer } from "http";
import { FRONTEND_URL } from "../constants/env";

interface User {
  userId: string;
  socketId: string;
  online: boolean;
  lastSeen: Date;
}

export default function initializeSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    },
  });

  let users: User[] = [];

  // Socket helper functions
  const addUser = (userId: string, socketId: string) => {
    const existingUserIndex = users.findIndex((user) => user.userId === userId);
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = {
        ...users[existingUserIndex],
        socketId,
        online: true,
        lastSeen: new Date(),
      };
    } else {
      users.push({ userId, socketId, online: true, lastSeen: new Date() });
    }
  };

  const removeUser = (socketId: string) => {
    users = users.map((user) =>
      user.socketId === socketId
        ? { ...user, online: false, lastSeen: new Date() }
        : user
    );
  };

  const getUser = (userId: string) => {
    // console.log("user ", users);
    const ddd = users.find((user) => user.userId === userId);
    // console.log("dddid", ddd);
    return ddd;
    // return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log(`${colorize("New client connected", "magenta")}`, socket.id);

    socket.on("addUser", (userId) => {
      // console.log("userID--", userId);

      addUser(userId, socket.id);
      // console.log("Users after add:", users);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", (data: any) => {
      // console.log("Sending message data--------------------:", data);
      const user = getUser(data.receiver);
      // console.log("sedmessage-----user:-----", user);
      io.to(user ? user.socketId : "").emit("newMessage", data);
    });

    socket.on("disconnect", () => {
      console.log(`${colorize("Client disconnected", "red")}`, socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
}
