import { ObjectId } from "mongoose";
import { IMessage } from "./message";

export interface IChat extends Document {
  participants: ObjectId;
  messages: IMessage;
  lastMessage: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
