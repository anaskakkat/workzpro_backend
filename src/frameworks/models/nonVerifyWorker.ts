import mongoose, { Model, Schema, Document } from "mongoose";
import Worker from "../../entities/worker";

const workingDaySchema: Schema = new Schema({
  start: {
    type: String,
    default: "09:00",
    required: true,
  },
  end: {
    type: String,
    default: "17:00",
    required: true,
  },
  isWorking: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const nonWorkerSchema: Schema<Worker & Document> = new Schema(
  {
    workerId: {
      type: Number,
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
      // required: true,
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
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    experience: {
      type: Number,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    locationName: {
      type: String,
    },
    workRadius: {
      type: Number,
      default: 0,
    },
    identityProof: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    wageDay: {
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
    isProfileSetup: {
      type: Boolean,
      default: false,
    },
    loginAccess: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["notVerified", "verified"],
      default: "notVerified",
      required: true,
    },
    images: {
      type: [String],
    },
    configuration: {
      workingDays: {
        type: [workingDaySchema],
        default: [
          { isWorking: false, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
          { isWorking: true, start: "09:00", end: "17:00" },
        ],
      },
      slotSize: { type: Number, default: 1 },
      bufferTime: { type: Number, default: 30 },
      services: [
        {
          description: { type: String },
          amount: { type: Number },
          slots: { type: Number },
        },
      ],
      leaves: [
        {
          date: { type: Date },
          reason: {
            type: String,
          },
        },
      ],
    },
  },

  { timestamps: true }
);

const NonVerifyWorkerModel: Model<Worker & Document> = mongoose.model<
  Worker & Document
>("NonVerifyWorker", nonWorkerSchema);

export default NonVerifyWorkerModel;
