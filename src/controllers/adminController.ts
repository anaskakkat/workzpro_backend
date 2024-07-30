import { log } from "console";
import { NextFunction, Request, Response } from "express";
import AdminUsecase from "../use-cases/adminUsecase";
import { NODE_ENV } from "../frameworks/constants/env";

class AdminController {
  private _adminUsecase: AdminUsecase;
  constructor(adminUsecase: AdminUsecase) {
    this._adminUsecase = adminUsecase;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    console.log("touched");

    try {
      const { email, password } = req.body;
      const verified = await this._adminUsecase.verifylogin(email, password);
      console.log(verified);
      if (
        verified?.status === 200 &&
        verified?.tokens?.accessToken &&
        verified.tokens.refreshToken
      ) {
        res.cookie("admin_access_token", verified.tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "strict",
        });
        res.cookie("admin_refresh_token", verified.tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          sameSite: "strict",
        });
        return res.status(verified.status).json({
          message: verified.message,
          admin: verified.admin,
        });
      } else {
        return res.status(verified?.status || 400).json({
          message: verified?.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("admin_access_token", "", {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
      });
      res.cookie("admin_refresh_token", "", {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
