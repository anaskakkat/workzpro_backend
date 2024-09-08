import express from "express";
import UserChatRepository from "../../repository/userChatRepository";
import UserChatController from "../../controllers/userChatController";
import UserChatUsecase from "../../use-cases/userChatUsecase";

const userChatRouter = express.Router();

// Instantiate repository
const chatRepository = new UserChatRepository();

// Instantiate use case with the repository
const chatUsecase = new UserChatUsecase(chatRepository);

// Instantiate controller with the use case
const chatController = new UserChatController(chatUsecase);

userChatRouter.post("/", (req, res, next) => {
  chatController.addChat(req, res, next);
});
userChatRouter.get("/:userId", (req, res, next) => {
  chatController.userChats(req, res, next);
});
userChatRouter.get("/:userId", (req, res, next) => {
  chatController.findChats(req, res, next);
});
userChatRouter.get("/messages/:chatId", (req, res, next) => {
  chatController.messages(req, res, next);
});
userChatRouter.post("/addMessage", (req, res, next) => {
  chatController.addMessage(req, res, next);
});

export default userChatRouter;
