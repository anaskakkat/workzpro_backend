import mongoose, { Model, Schema,ObjectId, Document } from "mongoose";
import Worker from "../../entities/worker";

const WorkerSchema: Schema<Worker & Document> = new Schema(
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
    slots: { 
      type: [mongoose.Schema.Types.ObjectId]
    },
    commonProblems: { 
      type: [mongoose.Schema.Types.ObjectId]
    }
  },

  { timestamps: true }
);

// Geospatial Indexing
WorkerSchema.index({ location: "2dsphere" });

const WorkerModel: Model<Worker & Document> = mongoose.model<Worker & Document>(
  "Worker",
  WorkerSchema
);

export default WorkerModel;
