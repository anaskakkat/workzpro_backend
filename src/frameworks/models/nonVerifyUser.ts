import mongoose, { Model, Schema, Document } from "mongoose";
import User from "../../entities/user";

const nonVerifyuserSchema: Schema<User & Document> = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    wallet: {
      type: Number,
      default: 0,
    },
    profilePicture: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "notVerfied",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel: Model<User & Document> = mongoose.model<User & Document>(
  "nonVerifyUser",
  nonVerifyuserSchema
);

export default UserModel;
