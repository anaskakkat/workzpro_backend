import { ObjectId } from "mongoose";

interface problams {
  _id?: ObjectId;
  workerId: ObjectId;
  problemName: String;
  estimatedHour: Number;
}

export default problams;
