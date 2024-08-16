import { ObjectId } from "mongoose";

interface IBooking {
  _id?: ObjectId
  userId: String;
  workerId: String;
  name: String;
  email: String;
  phone: String;
  address: String;
  selectedSlot: ObjectId;
  location: String;
  comments?: String;
  date?: String;
}

export default IBooking;
