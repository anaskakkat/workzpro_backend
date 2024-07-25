import express from "express";
import dotenv from 'dotenv'
import cors from "cors"; 
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes'
import morgan from 'morgan'
dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'))

//cors-----------------------------
app.use(
    cors({
      origin: "http://localhost:8000",
      credentials: true,
    })
  );

//routes-------------------------


app.use('/api/user',userRoutes)

export default app;
