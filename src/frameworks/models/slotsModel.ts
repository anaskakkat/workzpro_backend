import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import Slot from "../../entities/slots";
import { time } from "console";

// Define the Mongoose schema based on the Slot entity
const slotSchema: Schema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    isCreated: {
      type: Boolean,
      default: false,
    },
    slots: [
      {
        date: {type: Date,required: true,},
        time: {type: String,enum: ["fullDay", "morning", "afternoon"],required: true,},
        booked: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
              
            },
            status: {
              type: Boolean,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Define the SlotModel using the Slot entity interface for type safety
const SlotModel: Model<Slot & Document> = mongoose.model<Slot & Document>(
  "Slot",
  slotSchema
);

export default SlotModel;
