import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  totalAmount: number;
  workerAmount: number;
  adminProfit: number;
  paymentStatus: "pending" | "success";
  createdAt: Date;
}
