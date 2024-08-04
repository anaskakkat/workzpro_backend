import { NextFunction, Request, Response } from "express";
import UserUsecase from "../use-cases/userUsecase";
import { NODE_ENV } from "../frameworks/constants/env";
import logger from "../frameworks/config/logger";
import { CostumeError } from "../frameworks/middlewares/customError";

class UserController {
  private _userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this._userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('req.body-----',req.body);

      const verifyUser = await this._userUsecase.checkExist(
        req.body.email,
        req.body.phoneNumber
      );
      // console.log("verifyUser:", verifyUser);

      if (verifyUser.status === 200) {
        const user = await this._userUsecase.signup(
          req.body.name,
          req.body.email,
          req.body.password,
          req.body.phoneNumber
        );
        return res
          .status(user.status)
          .json({ message: user.message, email: user.email });
      } else {
        throw new CostumeError(verifyUser.status, verifyUser.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async otpVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const verified = await this._userUsecase.verifyOtp(email, otp);
      // logger.info("otp--", verified);
      if (verified.status === 200 && verified.token) {
        res.cookie("user_access_token", verified.token, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("user_refresh_token", verified.token.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res
          .status(verified.status)
          .json({ message: verified.message, user: verified.userData });
      }
      // throw new CostumeError(verified.status, verified.message);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const verified = await this._userUsecase.resendOtp(
        req.body.email as string
      );

      return res.status(verified.status).json(verified);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const verified = await this._userUsecase.verfyLogin(email, password);
      // console.log("v----", verified);
      if (
        verified?.status === 200 &&
        verified?.tokens?.accessToken &&
        verified.tokens.refreshToken
      ) {
        res.cookie("user_access_token", verified.tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 15 * 1000,
          sameSite: "strict",
        });
        res.cookie("user_refresh_token", verified.tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res.status(verified.status).json({
          message: verified.message,
          user: verified.user,
        });
      } else {
        // console.log('touched',verified);

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
      res.cookie("user_access_Token", "", {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
      });
      res.cookie("user_refresh_token", "", {
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
export default UserController;
