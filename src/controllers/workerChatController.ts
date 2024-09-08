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
      // console.log('Workers---touched',Workers);
      return res.status(chat.status).json(chat.chat);
    } catch (error) {
      next(error);
    }
  }
}

export default workerChatController;
