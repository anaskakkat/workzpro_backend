import express from "express";
import errorHandle from "../middlewares/errorHandle";
import AdminController from "../../controllers/adminController";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../use-cases/adminUsecase";
import EncryptPassword from "../utils/bcryptPassword";
import JWTService from "../utils/generateToken";
import { log } from "console";
import adminAuth from "../middlewares/adminAuth";
import NodemailerEmailService from "../utils/sentMail";

const adminRouter = express.Router();

//services----------------

//repository's------------
const adminRepository = new AdminRepository();
const encryptPassword = new EncryptPassword();
const jwtService = new JWTService();
const nodeMailerService = new NodemailerEmailService();

//useCases----------------
const adminUsecase = new AdminUsecase(
  adminRepository,
  encryptPassword,
  jwtService,
  nodeMailerService
);
//controllers-------------
const adminController = new AdminController(adminUsecase);

adminRouter.post("/login", (req, res, next) => {
  adminController.login(req, res, next);
});
adminRouter.post("/logout", adminAuth, (req, res, next) => {
  adminController.logout(req, res, next);
});
adminRouter.post("/users", adminAuth, (req, res, next) => {
  adminController.getUsers(req, res, next);
});
adminRouter.patch("/users/:id", adminAuth, (req, res, next) => {
  adminController.blockUser(req, res, next);
});
adminRouter.patch("/users/:id/unblock", adminAuth, (req, res, next) => {
  adminController.unblockUser(req, res, next);
});
adminRouter.post("/services", adminAuth, (req, res, next) => {
  adminController.createServices(req, res, next);
});
adminRouter.post("/get_services", adminAuth, (req, res, next) => {
  adminController.getServices(req, res, next);
});
adminRouter.patch("/services/:id/block", adminAuth, (req, res, next) => {
  adminController.blockServices(req, res, next);
});
adminRouter.patch("/services/:id/unblock", adminAuth, (req, res, next) => {
  adminController.unblockServices(req, res, next);
});
adminRouter.put("/services/:id", adminAuth, (req, res, next) => {
  adminController.editServices(req, res, next);
});
adminRouter.get("/getworkers", adminAuth, (req, res, next) => {
  adminController.getWorkers(req, res, next);
});
adminRouter.patch("/workers/:id/block", adminAuth, (req, res, next) => {
  adminController.blockWorker(req, res, next);
});
adminRouter.patch("/workers/:id/unblock", adminAuth, (req, res, next) => {
  adminController.unblockWorker(req, res, next);
});
adminRouter.patch("/request/:id", adminAuth, (req, res, next) => {
  adminController.worker_request(req, res, next);
});
adminRouter.patch("/requestReject/:id", adminAuth, (req, res, next) => {
  adminController.requestReject(req, res, next);
});

export default adminRouter;
