import { Server } from "socket.io";
import colorize from "../utils/colorize";

export default function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("new client connected", socket.id);

    const userId = socket.handshake.query.userId as string;
    const workerId = socket.handshake.query.workerId as string;
    console.log(
      `${colorize("Received userId:", "blue")} ${colorize(userId, "green")}`
    );
    socket.on("setup", (userId) => {
      socket.join(userId);
      
      console.log("user connected", userId);

      socket.emit("connected");
    });
    socket.on("newMesage", (newMessage) => {
      const { chatId, receiver } = newMessage;
      socket.to(receiver).emit("messageReceived", newMessage);
      console.log("New message sent:", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}
