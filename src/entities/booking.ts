import { ObjectId, Schema } from "mongoose";

// Define IBooking interface
interface IBooking extends Document {
  userId: Schema.Types.ObjectId;
  workerId: Schema.Types.ObjectId;

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

export default IBooking;
