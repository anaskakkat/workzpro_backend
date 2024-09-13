import mongoose from "mongoose";
import ChatsModel from "../frameworks/models/chatsModel";
import MessageModel from "../frameworks/models/messageModel";

class WorkerChatRepository {
  async findExistChat(senderId: string, receiverId: string) {
    return await ChatsModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
  }
  async saveChat(senderId: string, receiverId: string, recieverName: string) {
    const newChat = new ChatsModel({
      participants: [senderId, receiverId],
      recieverName,
    });
    return await newChat.save();
  }
  async findWorkerChats(workerId: string) {
    // console.log("--findWorkerChats----workerId---", workerId);

    const messageDatas = await MessageModel.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(workerId) } },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id", 
          as: "receiverDetails",
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "chatId",
          foreignField: "_id",
          as: "chatDetails",
        },
      },
    ]);

    // console.log("iam message datas------", messageDatas);

    const nameDatas = messageDatas.map((user) => {
      // console.log("userdetaillss------.>>>>>>", user.receiverDetails);

      return {
        name: user.receiverDetails[0].userName,
        chatId: user.chatDetails[0],
      };
    });
    // console.log("iam nameDatas", nameDatas);

    function getUniqueObjectsByName(nameDatas: any) {
      const uniqueMap = new Map();

      for (const item of nameDatas) {
        if (!uniqueMap.has(item.name)) {
          uniqueMap.set(item.name, item);
        }
      }

      // console.log(uniqueMap);
      return Array.from(uniqueMap.values());
    }

    const uniqueObject = getUniqueObjectsByName(nameDatas);
    // console.log(uniqueObject);
    return uniqueObject;
  }
  async findUserAllChats(workerId: string) {
    return await ChatsModel.find({
      participants: { $in: [workerId] },
    });
  }
  async saveMessage(
    chatId: string,
    sender: string,
    receiver: string,
    message: string
  ) {
    const savedMessage = new MessageModel({
      chatId,
      sender,
      receiver,
      message,
    });
    return await savedMessage.save();
  }

  async saveMessageIdToChats(chatId: string, messageId: string) {
    // console.log("--repo---saveMesage", chatId, "---", messageId);

    return await ChatsModel.findOneAndUpdate(
      { _id: chatId },
      {
        $push: { messages: messageId },
        $set: { lastMessage: messageId },
      },
      { new: true }
    );
  }
}

export default WorkerChatRepository;
