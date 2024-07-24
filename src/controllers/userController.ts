import { NextFunction, Request, Response } from "express";
import UserUsecase from "../use-cases/userUsecase";

class UserController {
  private _userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this._userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("body:", req.body);

      const verifyUser = await this._userUsecase.checkExist(
        req.body.email,
        req.body.phoneNumber
      );

      if (verifyUser.status === 200) {
        const user = await this._userUsecase.signup(
          req.body.name,
          req.body.email,
          req.body.password,
          req.body.mobile,
        );
        return res.status(user.status).json(user.message);
      } else {
        return res.status(verifyUser.status).json(verifyUser.message);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
