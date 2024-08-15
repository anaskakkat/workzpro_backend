import { ObjectId } from "mongoose";

interface IBooking {
  _id?: String
  userId: String;
  workerId: String;
  name: String;
  email: String;
  phone: String;
  address: String;
  selectedSlot: String;
  location: String;
  comments?: String;
  date?: String;
}

export default IBooking;
