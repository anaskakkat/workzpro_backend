import ChatsModel from "../frameworks/models/chatsModel";
import WorkerChatRepository from "../repository/workerChatRepository";

class WorkerChatUsecase {
  private _workerChatRepository: WorkerChatRepository;
  constructor(chatRepository: WorkerChatRepository) {
    this._workerChatRepository = chatRepository;
  }

  async chat(senderId: string, receiverId: string, recieverName: string) {
    try {
      // Check if a chat already exists between the sender and receiver
      const existingChat = await this._workerChatRepository.findExistChat(
        senderId,
        receiverId
      );

      if (existingChat) {
        return {
          status: 200,
          message: "Chat already exists",
        };
      }
      await this._workerChatRepository.saveChat(
        senderId,
        receiverId,
        recieverName
      );

      return {
        status: 200,
        message: "Chat created successfully",
      };
    } catch (error) {
      throw error;
    }
  }
  async workerChats(workerId: string) {
    try {
      const data = await this._workerChatRepository.findWorkerChats(workerId);
      return {
        status: 200,
        chat: data,
      };
    } catch (error) {
      throw error;
    }
  }
  async findChats(workerId: string) {
    try {
      const data = this._workerChatRepository.findUserAllChats(workerId);
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
      const savedMessage = await this._workerChatRepository.saveMessage(
        chatId,
        sender,
        receiverId,
        message
      );
    //   console.log("savedMessages", savedMessage);

      const result = await this._workerChatRepository.saveMessageIdToChats(
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

export default WorkerChatUsecase;
