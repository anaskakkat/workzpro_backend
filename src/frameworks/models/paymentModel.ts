import mongoose from "mongoose";
import { IPayment } from "../../entities/payment";

const paymentSchema = new mongoose.Schema<IPayment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  totalAmount: { type: Number, required: true },
  workerAmount: { type: Number, required: true },
  adminProfit: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);

export default PaymentModel;
