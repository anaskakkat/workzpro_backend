import express from "express";

import UserController from "../../controllers/userController";
import UserRepository from "../../repository/userRepository";
import UserUsecase from "../../use-cases/userUsecase";
import errorHandle from "../middlewares/errorHandle";
import GenerateOtp from "../utils/generateOtp";
import EncryptOtp from "../utils/bcryptOtp";
import EncryptPassword from "../utils/bcryptPassword";
import NodemailerEmailService from "../utils/sentMail";

const userRouter = express.Router();

//services----------------
const generateOtp = new GenerateOtp();
const encryptOtp = new EncryptOtp();
const encryptPassword = new EncryptPassword();
const nodeMailerService = new NodemailerEmailService();
//repository's------------
const userRepository = new UserRepository();

//useCases----------------
const userCase = new UserUsecase(
  userRepository,
  generateOtp,
  encryptOtp,
  encryptPassword,
  nodeMailerService
);

//controllers-------------
const userController = new UserController(userCase);

userRouter.post("/signup", (req, res, next) => {
  // console.log("signUp reached",req.body);

  userController.signUp(req, res, next);
});

userRouter.use(errorHandle);

export default userRouter;
