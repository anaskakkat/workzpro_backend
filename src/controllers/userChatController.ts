import { NextFunction, Request, Response } from "express";
import UserChatUsecase from "../use-cases/userChatUsecase";
import { CostumeError } from "../frameworks/middlewares/customError";
import uploadToCloudinary from "../frameworks/utils/ClouinaryUpload";

class UserChatController {
  private _chatUsecase: UserChatUsecase;

  constructor(chatUsecase: UserChatUsecase) {
    this._chatUsecase = chatUsecase;
  }
  async addChat(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("body---", req.body);

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
  async messages(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await this._chatUsecase.messages(req.params.chatId);
      return res.status(message.status).json(message.messages);
    } catch (error) {
      next(error);
    }
  }
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("addMessage---body----touched", req.body);
      // console.log("addMessage--image-----touched", req.file);

      const { chatId, sender, receiver, message } = req.body;
      const imageFile = req.file;
      let imageUrl: string | undefined;
      if (!message && !imageFile) {
        throw new CostumeError(400, "Message or image is required.");
      }
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, "chat_pictures");
      }
      console.log("addMessage-------imageUrl", imageUrl);

      const chat = await this._chatUsecase.addMessage(
        chatId,
        sender,
        receiver,
        message,
        imageUrl
      );
      console.log("--addmessage---", chat);
      return res.status(chat.status).json(chat.chat);
    } catch (error) { 
      next(error);
    }
  }
}

export default UserChatController;
