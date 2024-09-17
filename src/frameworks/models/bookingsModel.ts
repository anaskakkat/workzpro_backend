import mongoose, { Model, Schema, Document } from "mongoose";

// Define IBooking interface
interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  review?: mongoose.Types.ObjectId;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  bookingNumber: string | number;
  description: string;
  bookingDate: Date;
  slots: string;
  service: {
    service: string;
    amount: number;
    slot: number;
  };
  address: {
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    pincode: string | number;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  paymentStatus: "pending" | "success";
  paymentDate?: Date;
  currentDate: Date;
}

// Define the address schema separately
const AddressSchema = new Schema(
  {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: Schema.Types.Mixed,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { _id: false }
);

// Define the service schema
const ServiceSchema = new Schema(
  {
    service: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    slot: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    bookingNumber: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: { type: String, required: true },
    bookingDate: { type: Date, required: true, index: true },
    slots: { type: String, required: true },
    service: { type: ServiceSchema, required: true },
    address: { type: AddressSchema, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
      required: true,
    },
    paymentDate: { type: Date },
    currentDate: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);

export default BookingModel;
