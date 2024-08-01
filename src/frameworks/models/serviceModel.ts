import mongoose, { Model, Schema } from "mongoose";
import IService from "../../entities/services";

const serviceSchema: Schema<IService> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const serviceModel: Model<IService> = mongoose.model<IService>(
  "Service",
  serviceSchema
);

export default serviceModel;
