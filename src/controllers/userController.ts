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
      const verifyUser = await this._userUsecase.checkExist(
        req.body.email,
        req.body.phoneNumber
      );

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
        return res.status(verifyUser.status).json(verifyUser.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async otpVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const verified = await this._userUsecase.verifyOtp(email, otp);
      // console.log("isVerified:", verified);

      if (verified.status === 200 && verified.token) {
        res.cookie("jwt", verified.token, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res
          .status(verified.status)
          .json({ message: verified.message, user: verified.savedUser });
      }
      return res.status(verified.status).json(verified.message);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("here in resend");
      const verified = await this._userUsecase.resendOtp(
        req.body.email as string
      );

      return res.status(verified.status).json(verified);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
