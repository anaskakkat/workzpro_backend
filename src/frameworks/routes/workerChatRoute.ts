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
  // console.log('----addChat-----');
  
  chatController.addChat(req, res, next);
});

workerChatRouter.get("/:workerId", (req, res, next) => {
  // console.log('----workerChats-----'); 

  chatController.workerChats(req, res, next);
});

  // workerChatRouter.get("/:userId", (req, res, next) => {
  // console.log('----findChats-----');

  //   chatController.findChats(req, res, next);
  // });
workerChatRouter.get("/messages/:chatId", (req, res, next) => {
  // console.log('----workerChats-----');

  chatController.messages(req, res, next);
});
  workerChatRouter.post("/addMessage", (req, res, next) => {
  // console.log('----addMessage-----');

    chatController.addMessage(req, res, next);
  });
export default workerChatRouter;
