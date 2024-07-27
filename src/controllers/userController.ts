import { NextFunction, Request, Response } from "express";
import UserUsecase from "../use-cases/userUsecase";
import { NODE_ENV } from "../frameworks/constants/env";

class UserController {
  private _userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this._userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      
      const verifyUser = await this._userUsecase.checkExist(
        req.body.email,
        req.body.mobile
      );
      console.log('verifyUser:',verifyUser);


      if (verifyUser.status === 200) {
        const user = await this._userUsecase.signup(
          req.body.name,
          req.body.email,
          req.body.password,
          req.body.mobile
        );
        return res
          .status(user.status)
          .json({ message: user.message, email: user.email });
      } else {
        return res.status(verifyUser.status).json(verifyUser);
      }
    } catch (error) {
      next(error);
    }
  }
  async otpVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const verified = await this._userUsecase.verifyOtp(email, otp);

      if (verified.status === 200 && verified.token) {
        res.cookie("jwt", verified.token, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res
          .status(verified.status)
          .json({ message: verified.message, user: verified.userData });
      }
      return res.status(verified.status).json(verified.message);
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

    const verified = await this._userUsecase.verfyLogin(email, password);

    if (verified.status === 200 && verified.token) {
      res.cookie("jwt", verified.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
    }
    return res.json({
      message: verified.message,
      user: verified.user,
    });
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("jwt", "", {
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
