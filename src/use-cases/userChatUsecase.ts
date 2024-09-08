import ChatsModel from "../frameworks/models/chatsModel";
import MessageModel from "../frameworks/models/messageModel";
import userChatRepository from "../repository/userChatRepository";

class userChatUsecase {
  private _chatRepository: userChatRepository;
  constructor(chatRepository: userChatRepository) {
    this._chatRepository = chatRepository;
  }

  async chat(senderId: string, receiverId: string, recieverName: string) {
    try {
      // Check if a chat already exists between the sender and receiver
      const existingChat = await this._chatRepository.findExistChat(
        senderId,
        receiverId
      );

      if (existingChat) {
        return {
          status: 200,
          message: "Chat already exists",
        };
      }
      await this._chatRepository.saveChat(senderId, receiverId, recieverName);

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
      const data = await this._chatRepository.findUserChats(userId);
      return {
        status: 200,
        chat: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async findChats(userId: string) {
    try {
      const data = this._chatRepository.findUserAllChats(userId);
      return {
        status: 200,
        chat: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async addMessage(
    chatId: string,
    sender: string,
    receiverId: string,
    message: string
  ) {
    try {
      const savedMessage = await this._chatRepository.saveMessage(
        chatId,
        sender,
        receiverId,
        message
      );
      console.log("savedMessages", savedMessage);

      const result = await this._chatRepository.saveMessageIdToChats(
        chatId,
        savedMessage._id as string
      );

      return {
        status: 200,
        chat: result,
      };
    } catch (error) {
      throw error;
    }
  }
  async messages(chatId: string) {
    try {
      const messages = await ChatsModel.findById(chatId).populate("messages");
      // console.log("message----", messages);

      return {
        status: 200,
        messages,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default userChatUsecase;
