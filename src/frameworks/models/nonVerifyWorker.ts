import mongoose, { Model, Schema, Document } from "mongoose";
import Worker from "../../entities/worker";

const nonWorkerSchema: Schema<Worker & Document> = new Schema(
  {
    workerId: {
      type: Number,
      required: true,
    },
    name: {
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
      default: "worker",
    },
    service: {
      type: Object,
    },
    experience: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
    identityProof: {
      type: String,
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
      default: "notVerified",
      required: true,
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

const NonVerifyWorkerModel: Model<Worker & Document> = mongoose.model<
  Worker & Document
>("NonVerifyWorker", nonWorkerSchema);

export default NonVerifyWorkerModel;
