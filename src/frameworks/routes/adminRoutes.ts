import express from "express";
import errorHandle from "../middlewares/errorHandle";
import AdminController from "../../controllers/adminController";
import AdminRepository from "../../repository/adminRepository";
import AdminUsecase from "../../use-cases/adminUsecase";
import EncryptPassword from "../utils/bcryptPassword";
import { log } from "console";
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

adminRouter.use(errorHandle);

export default adminRouter;
