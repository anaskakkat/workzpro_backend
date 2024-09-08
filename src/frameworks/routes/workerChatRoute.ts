import express from "express";
import workerChatUsecase from "../../use-cases/workerChatUsecase";
import workerChatController from "../../controllers/workerChatController";
import workerAuth from "../middlewares/workerAuth";
import WorkerChatRepository from "../../repository/workerChatRepository";

const workerChatRouter = express.Router();

// Instantiate repository
const chatRepository = new WorkerChatRepository();

// Instantiate use case with the repository
const chatUsecase = new workerChatUsecase(chatRepository);

// Instantiate controller with the use case
const chatController = new workerChatController(chatUsecase);
workerChatRouter.post("/", workerAuth, (req, res, next) => {
  chatController.addChat(req, res, next);
});

workerChatRouter.get("/:workerId", (req, res, next) => {
    chatController.workerChats(req, res, next);
  });


//   userChatRouter.get("/:userId", (req, res, next) => {
//     chatController.findChats(req, res, next);
//   });
//   userChatRouter.get("/messages/:chatId", (req, res, next) => {
//     chatController.messages(req, res, next);
//   });
//   userChatRouter.post("/addMessage", (req, res, next) => {
//     chatController.addMessage(req, res, next);
//   });
export default workerChatRouter;
