import mongoose, { Model, Schema, Document } from "mongoose";
import { IChat } from "../../entities/chats";

const ChatsSchema: Schema<IChat & Document> = new Schema({
  participants: [{ type: Schema.Types.ObjectId }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ChatsModel: Model<IChat & Document> = mongoose.model<IChat & Document>(
  "Chat",
  ChatsSchema
);

export default ChatsModel;
