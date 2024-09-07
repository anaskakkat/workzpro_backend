import mongoose, { Model, Schema, Document } from "mongoose";
import { IMessage } from "../../entities/message";

const messageSchema: Schema<IMessage & Document> = new Schema({
  chatId: { type: Schema.Types.ObjectId },
  sender: { type: Schema.Types.ObjectId },
  receiver: { type: Schema.Types.ObjectId },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const MessageModel: Model<IMessage & Document> = mongoose.model<
  IMessage & Document
>("Message", messageSchema);

export default MessageModel;
