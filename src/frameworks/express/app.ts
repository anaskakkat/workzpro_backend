import express from "express";
import dotenv from 'dotenv'
import cors from "cors"; 
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes'
dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//cors-----------------------------
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

//routes-------------------------


app.use('/api/user',userRoutes)

export default app;
