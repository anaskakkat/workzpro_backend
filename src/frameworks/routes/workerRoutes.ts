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
import { upload } from "../middlewares/multer";
import workerAuth from "../middlewares/workerAuth";

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
workerRouter.post("/login", (req, res, next) => {
  workerController.login(req, res, next);
});
workerRouter.post("/googleAuth/", (req, res, next) => {
  workerController.googleAuth(req, res, next);
});

workerRouter.post("/logout", workerAuth, (req, res, next) => {
  workerController.logout(req, res, next);
});
workerRouter.get("/services", workerAuth, (req, res, next) => {
  workerController.services(req, res, next);
});
workerRouter.post(
  "/setProfile",
  workerAuth,
  upload.fields([{ name: "profilePic" }, { name: "identityProof" }]),
  (req, res, next) => {
    workerController.setProfile(req, res, next);
  }
);
workerRouter.post("/addProblam", workerAuth, (req, res, next) => {
  workerController.addProblam(req, res, next);
});
workerRouter.post("/slots/:id", workerAuth, (req, res, next) => {
  workerController.setSlots(req, res, next);
});
workerRouter.get("/slots/:id", workerAuth, (req, res, next) => {
  workerController.fetchSlots(req, res, next);
});
workerRouter.delete("/slots/:id", workerAuth, (req, res, next) => {
  workerController.deleteSlot(req, res, next);
});
workerRouter.patch("/booking/:id", workerAuth, (req, res, next) => {
  workerController.bookingAccept(req, res, next);
});

workerRouter.get("/commonProblams/:id", workerAuth, (req, res, next) => {
  workerController.commonProblams(req, res, next);
});
export default workerRouter;
