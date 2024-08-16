import { ObjectId, Schema } from "mongoose";

interface Slot {
  _id?: ObjectId;
  workerId: Schema.Types.ObjectId;
  isBooked: boolean;
  date: Date;
  time: string;
  bookedUserId?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Slot;
