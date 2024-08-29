import mongoose, { Model, Schema, Document } from "mongoose";
import IBooking from "../../entities/booking";

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
    _id: { type: Schema.Types.ObjectId, required: false },
    service: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    slot: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// Define the payment details schema
const PaymentDetailsSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
      required: true,
    },
    date: { type: Date, default: null },
  },
  { _id: false }
);

const BookingSchema: Schema<IBooking & Document> = new Schema(
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
    paymentDetails: { type: PaymentDetailsSchema, },
  },
  {
    timestamps: true, 
  }
);

const BookingModel: Model<IBooking & Document> = mongoose.model<IBooking & Document>(
  "Booking",
  BookingSchema
);

export default BookingModel;
