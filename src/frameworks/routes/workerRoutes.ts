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
workerRouter.get("/allServices", workerAuth, (req, res, next) => {
  workerController.allServices(req, res, next);
});
workerRouter.post(
  "/setProfile",
  workerAuth,
  upload.fields([{ name: "profilePic" }, { name: "identityProof" }]),
  (req, res, next) => {
    workerController.setProfile(req, res, next);
  }
);

workerRouter.get("/:id", workerAuth, (req, res, next) => {
  workerController.getWorker(req, res, next);
});

workerRouter.patch("/workingdays/:id", workerAuth, (req, res, next) => {
  workerController.workingdays(req, res, next);
});

workerRouter.get("/service/:id", workerAuth, (req, res, next) => {
  workerController.service(req, res, next);
});
workerRouter.post("/addService/:id", workerAuth, (req, res, next) => {
  workerController.addService(req, res, next);
});
workerRouter.patch("/services/:id", workerAuth, (req, res, next) => {
  workerController.editServices(req, res, next);
});

workerRouter.patch("/deleteService/:id", workerAuth, (req, res, next) => {
  workerController.deleteService(req, res, next);
});
workerRouter.post("/leave/:id", workerAuth, (req, res, next) => {
  workerController.addLeave(req, res, next);
});
workerRouter.get("/leave/:id", workerAuth, (req, res, next) => {
  workerController.getLeave(req, res, next);
});
workerRouter.patch("/deleteLeave/:id", workerAuth, (req, res, next) => {
  workerController.deleteLeave(req, res, next);
});
workerRouter.get("/bookings/:id", workerAuth, (req, res, next) => {
  workerController.bookings(req, res, next);
});
workerRouter.patch("/bookings/:id", workerAuth, (req, res, next) => {
  workerController.acceptBooking(req, res, next);
});
workerRouter.patch("/bookings/reject/:id", workerAuth, (req, res, next) => {
  workerController.rejectBooking(req, res, next);
});
workerRouter.patch(
  "/profile/:id",
  workerAuth,
  upload.single("profilePic"),
  (req, res, next) => {
    workerController.updateProfile(req, res, next);
  }
);

export default workerRouter;
