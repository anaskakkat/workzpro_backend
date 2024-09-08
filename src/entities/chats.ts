import { ObjectId } from "mongoose";
import { IMessage } from "./message";

export interface IChat extends Document {
  participants: ObjectId;
  messages: IMessage;
  recieverName: string;
  lastMessage: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
