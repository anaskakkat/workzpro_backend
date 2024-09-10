import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";

// Import routes
import userRoutes from "../routes/userRoutes";
import workerRoutes from "../routes/workerRoutes";
import adminRoutes from "../routes/adminRoutes";
import bookingRouter from "../routes/bookingRoutes";
import userChatRouter from "../routes/userChatRoutes";
import workerChatRouter from "../routes/workerChatRoute";

// Import middleware
import errorHandle from "../middlewares/errorHandle";

dotenv.config();
const app = express();
const server = http.createServer(app);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/booking", bookingRouter);
app.use("/api/user/chat", userChatRouter);
app.use("/api/worker", workerRoutes);
app.use("/api/worker/chat", workerChatRouter);

app.use(errorHandle);

export { app, server };
