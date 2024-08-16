import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/userRoutes";
import morgan from "morgan";
import workerRoutes from "../routes/workerRoutes";
import adminRoutes from "../routes/adminRoutes";
import errorHandle from "../middlewares/errorHandle";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

//cors-----------------------------
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

//routes-------------------------

app.use("/api/user", userRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandle);

export default app;
