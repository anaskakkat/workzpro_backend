import { NextFunction, Request, Response } from "express";
import UserChatUsecase from "../use-cases/userChatUsecase";

class UserChatController {
  private _chatUsecase: UserChatUsecase;

  constructor(chatUsecase: UserChatUsecase) {
    this._chatUsecase = chatUsecase;
  }
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { senderId, recieverId } = req.body;
      const chat = await this._chatUsecase.chat(senderId, recieverId);
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
      const { userId, receiverId } = req.params;
      const chat = await this._chatUsecase.findChats(userId, receiverId);
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("body-------touched", req.body);

      const { chatId, senderId, message } = req.body;
      const chat = await this._chatUsecase.addMessage(
        chatId,
        senderId,
        message
      );
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
}

export default UserChatController;
