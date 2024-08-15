import { ObjectId, Schema } from "mongoose";

interface Slot {
  type: any;
  workerId: Schema.Types.ObjectId;
  slots: {
    isBooked: boolean;
    date: Date;
    time: string;
    booked: {
      userId: Schema.Types.ObjectId;
      status: boolean;
    }[];
  }[];
}

export default Slot;
