import mongoose, { Schema, Document, Model } from "mongoose";

interface ISlot extends Document {
  workerId: mongoose.Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  bookedUserId?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
}

const SlotSchema: Schema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String,
      enum: ["fullDay", "morning", "afternoon"],
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create compound indexes for efficient querying
SlotSchema.index({ workerId: 1, date: 1, startTime: 1 });
SlotSchema.index({ bookedUserId: 1, date: 1 });

const SlotModel: Model<ISlot> = mongoose.model<ISlot>("Slot", SlotSchema);

export default SlotModel;
