import mongoose, { Schema, Document, Model } from "mongoose";
import Slot from "../../entities/slots";



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



const SlotModel: Model<Slot> = mongoose.model<Slot>("Slot", SlotSchema);

export default SlotModel;
