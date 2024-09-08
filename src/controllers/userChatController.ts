import { NextFunction, Request, Response } from "express";
import UserChatUsecase from "../use-cases/userChatUsecase";

class UserChatController {
  private _chatUsecase: UserChatUsecase;

  constructor(chatUsecase: UserChatUsecase) {
    this._chatUsecase = chatUsecase;
  }
  async addChat(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("body---", req.body);

      const { senderId, recieverId, recieverName } = req.body;
      const chat = await this._chatUsecase.chat(
        senderId,
        recieverId,
        recieverName
      );
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.message);
    } catch (error) {
      next(error);
    }
  }
  async userChats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const chat = await this._chatUsecase.userChats(userId);
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
  async findChats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const chat = await this._chatUsecase.findChats(userId);
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("addMessage-------touched", req.body);

      const { chatId, senderId, receiverId,message} = req.body;
      const chat = await this._chatUsecase.addMessage(
        chatId,
        senderId,
        receiverId,
        message
      );
      // // console.log('Workers---touched',Workers);
      // return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
  async messages(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("chatId-------touched", req.params.chatId);

      const message = await this._chatUsecase.messages(req.params.chatId);
      // console.log('message---touched',message);

      return res.status(message.status).json(message.messages);
    } catch (error) {
      next(error);
    }
  }
}

export default UserChatController;
