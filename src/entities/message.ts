import { ObjectId } from "mongoose";

export interface IMessage extends Document {
  chatId?: ObjectId;
  sender?: ObjectId;
  receiver: ObjectId;
  message?: string;
  image?: string;
  timestamp: Date;
  read: boolean;
}
