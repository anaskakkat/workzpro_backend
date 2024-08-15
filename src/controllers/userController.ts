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
          maxAge: 15 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("user_refresh_token", verified.tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        // console.log("Login touched", verified);
        const userData = {
          _id: verified.user._id,
          userName: verified.user.userName,
          email: verified.user.email,
          phoneNumber: verified.user.phoneNumber,
          wallet: verified.user.wallet,
          role: verified.user.role,
          isBlocked: verified.user.isBlocked,
          status: verified.user.status,
          createdAt: verified.user.createdAt,
          updatedAt: verified.user.updatedAt,
        };
        return res.status(verified.status).json({
          message: verified.message,
          user: userData,
        });
      } else {
        // throw new CostumeError(verified?.status||400,verified?.message)
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
      res.cookie("user_access_token", "", {
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

      return res.status(200).json({ message: "Logout successfull" });
    } catch (error) {
      next(error);
    }
  }
  async services(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await this._userUsecase.services();
      // console.log('services---touched',services);
      return res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }
  async fetchWorkers(req: Request, res: Response, next: NextFunction) {
    try {
      const Workers = await this._userUsecase.fetchWorkers();
      // console.log('Workers---touched',Workers);
      return res.status(200).json(Workers);
    } catch (error) {
      next(error);
    }
  }
  async fetchWorkerByID(req: Request, res: Response, next: NextFunction) {
    try {
      const Workers = await this._userUsecase.fetchWorkerByID(req.params.id);
      // console.log('Workers---touched',Workers);
      return res.status(200).json(Workers);
    } catch (error) {
      next(error);
    }
  }
  async fetchSlotById(req: Request, res: Response, next: NextFunction) {
    try {
      const slot = await this._userUsecase.fetchSlotById(req.params.id);
      // console.log('slot---touched',slot);
      return res.status(200).json(slot);
    } catch (error) {
      next(error);
    }
  }
  async booking(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.params.id);
      console.log(req.body);
      const bookingData = await this._userUsecase.booking(
        req.params.id,
        req.body
      );
      console.log("slot---touched", bookingData);
      return res.status(200).json(bookingData);
    } catch (error) {
      next(error);
    }
  }
}
export default UserController;
