import mongoose, { Model, Schema, Document } from "mongoose";
import IBooking from "../../entities/booking";

// Define the booking schema
const bookingSchema: Schema<IBooking & Document> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker", 
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    selectedSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot", 
      required: true,
    },
    location: {
      type: String,
    },
    comments: {
      type: String,
      default: "", 
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Create the booking model
const bookingModel: Model<IBooking & Document> = mongoose.model<
  IBooking & Document
>("Booking", bookingSchema);

export default bookingModel;
