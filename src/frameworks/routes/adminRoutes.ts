import express from "express";
import errorHandle from "../middlewares/errorHandle";
import AdminController from "../../controllers/adminController";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../use-cases/adminUsecase";
import EncryptPassword from "../utils/bcryptPassword";
import JWTService from "../utils/generateToken";

const adminRouter = express.Router();

//services----------------

//repository's------------
const adminRepository = new AdminRepository();
const encryptPassword = new EncryptPassword();
const jwtService = new JWTService();

//useCases----------------
const adminUsecase = new AdminUsecase(
  adminRepository,
  encryptPassword,
  jwtService
);
//controllers-------------
const adminController = new AdminController(adminUsecase);

adminRouter.post("/login", (req, res, next) => {
  adminController.login(req, res, next);
});
adminRouter.post("/logout", (req, res, next) => {
  adminController.logout(req, res, next);
});
adminRouter.post("/users", (req, res, next) => {
  adminController.getUsers(req, res, next);
});
adminRouter.patch("/users/:id/block", (req, res, next) => {
  adminController.blockUser(req, res, next);
});
adminRouter.patch("/users/:id/unblock", (req, res, next) => {
  adminController.unblockUser(req, res, next);
});

adminRouter.use(errorHandle);

export default adminRouter;
