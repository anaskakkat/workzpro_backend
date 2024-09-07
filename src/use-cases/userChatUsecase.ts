import ChatsModel from "../frameworks/models/chatsModel";
import MessageModel from "../frameworks/models/messageModel";
import userChatRepository from "../repository/userChatRepository";

class userChatUsecase {
  private _chatRepository: userChatRepository;
  constructor(chatRepository: userChatRepository) {
    this._chatRepository = chatRepository;
  }

  async chat(senderId: string, receiverId: string) {
    try {
      // Check if a chat already exists between the sender and receiver
      const existingChat = await ChatsModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (existingChat) {
        return {
          status: 200,
          message: "Chat already exists",
        };
      }

      // If no chat exists, create a new one
      const newChat = new ChatsModel({
        participants: [senderId, receiverId],
      });
      await newChat.save();

      return {
        status: 200,
        message: "Chat created successfully",
      };
    } catch (error) {
      throw error;
    }
  }
  async userChats(userId: string) {
    try {
      const data = await ChatsModel.find({
        participants: { $in: [userId] },
      });
      return {
        status: 200,
        chat: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async findChats(userId: string, receiverId: string) {
    try {
      const data = await ChatsModel.find({
        participants: { $all: [userId, receiverId] },
      });
      return {
        status: 200,
        chat: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async addMessage(chatId: string, sender: string, message: string) {
    try {
      const data = new MessageModel({
        chatId,
        sender,
        message,
      });
      console.log("message----", data);

      const result = await data.save();
      return {
        status: 200,
        chat: result,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default userChatUsecase;
