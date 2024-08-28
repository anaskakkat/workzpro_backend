import { ObjectId, Schema } from "mongoose";

interface IBooking {
  _id?: ObjectId;
  userId: Schema.Types.ObjectId;
  workerId: Schema.Types.ObjectId;
  status: string;
  bookingNumber: string | number;
  description: string;
  bookingDate: Date;
  slots: string;
  service: {
    _id?: ObjectId;
    service: string;
    amount: number;
    slot: number;
  };
  paymentDetails: {
    status: "pending" | "success";
    date: Date | null;
  };
  address: {
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    pincode: string | Number;
    location: {
      coordinates: [number, number];
      type: "Point";
    };

    createdAt?: Date;
    updatedAt?: Date;
  };
}

export default IBooking;
