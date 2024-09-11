import { NextFunction, Request, Response } from "express";
import workerChatUsecase from "../use-cases/workerChatUsecase";

class workerChatController {
  private _workerchatUsecase: workerChatUsecase;

  constructor(chatUsecase: workerChatUsecase) {
    this._workerchatUsecase = chatUsecase;
  }
  async addChat(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("body---", req.body);

      const { senderId, recieverId, recieverName } = req.body;
      const chat = await this._workerchatUsecase.chat(
        senderId,
        recieverId,
        recieverName
      );
      // // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.message);
    } catch (error) {
      next(error);
    }
  }
  async workerChats(req: Request, res: Response, next: NextFunction) {
    try {
      const { workerId } = req.params;
      const chat = await this._workerchatUsecase.workerChats(workerId);
      //   console.log('chat---touched',chat);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
  async messages(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("chatId-------touched", req.params.chatId);

      const message = await this._workerchatUsecase.messages(req.params.chatId);
      //   console.log('message---touched',message);

      return res.status(message.status).json(message.messages);
    } catch (error) {
      next(error);
    }
  }
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("addMessage---worker----touched", req.body);

      const { chatId, sender, receiver, message } = req.body;
      const chat = await this._workerchatUsecase.addMessage(
        chatId,
        sender,
        receiver,
        message
      );
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
}

export default workerChatController;
