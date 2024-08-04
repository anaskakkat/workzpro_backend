import express from "express";
import errorHandle from "../middlewares/errorHandle";
import GenerateOtp from "../utils/generateOtp";
import EncryptOtp from "../utils/bcryptOtp";
import EncryptPassword from "../utils/bcryptPassword";
import NodemailerEmailService from "../utils/sentMail";
import JWTService from "../utils/generateToken";
import WorkerRepository from "../../repository/workerRepository";
import WorkerUsecase from "../../use-cases/workerUsecse";
import WorkerController from "../../controllers/workerController";

const workerRouter = express.Router();

//services----------------
const generateOtp = new GenerateOtp();
const encryptOtp = new EncryptOtp();
const encryptPassword = new EncryptPassword();
const nodeMailerService = new NodemailerEmailService();
const jwtService = new JWTService();
//repository's------------
const workerRepository = new WorkerRepository();

//useCases----------------
const workerUsecase = new WorkerUsecase(
  workerRepository,
  generateOtp,
  encryptOtp,
  encryptPassword,
  nodeMailerService,
  jwtService
);

const workerController = new WorkerController(workerUsecase);

// Define the routes
workerRouter.post("/signup", (req, res, next) => {
  //   console.log("signUp reached", req.body);
  workerController.signUp(req, res, next);
});
workerRouter.post("/otp", (req, res, next) => {
  workerController.otpVerify(req, res, next);
});
workerRouter.post("/logout", (req, res, next) => {
  workerController.logout(req, res, next);
});
workerRouter.post("/login", (req, res, next) => {
  workerController.login(req, res, next);
});
workerRouter.get("/services", (req, res, next) => {
  
  workerController.services(req, res, next);
});

// // Error handling middleware
// workerRouter.use(errorHandle);

export default workerRouter;
