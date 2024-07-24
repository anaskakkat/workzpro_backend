import mongoose, { Model, Schema } from "mongoose";
import Otp from "../../entities/otp";

const otpSchema: Schema = new Schema<Otp>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: { type: Number, required: true },
  profilepicture: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpGeneratedAt: {
    type: Date,
    required: true,
  },
});
const OtpModel: Model<Otp & Document> = mongoose.model<Otp & Document>(
  "Otp",
  otpSchema
);

export default OtpModel;
