import ChatsModel from "../frameworks/models/chatsModel";
import MessageModel from "../frameworks/models/messageModel";

class userChatRepository {
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
  async findUserChats(userId: string) {
    return await ChatsModel.find({
      participants: { $in: [userId] },
    });
  }
  async findUserAllChats(userId: string) {
    return await ChatsModel.find({
      participants: { $in: [userId] },
    });
  }
  async saveMessage(
    chatId: string,
    sender: string,
    receiverId: string,
    message: string
  ) {
    const savedMessage = new MessageModel({
      chatId,
      sender,
      receiverId,
      message,
    });
    return await savedMessage.save();
  }
  async saveMessageIdToChats(chatId: string, messageId: string) {
    console.log("--repo---saveMesage", chatId, "---", messageId);

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

export default userChatRepository;
