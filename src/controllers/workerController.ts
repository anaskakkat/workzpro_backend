import { NextFunction, Request, Response } from "express";
import WorkerUsecase from "../use-cases/workerUsecse";
import { NODE_ENV } from "../frameworks/constants/env";

class WorkerController {
  private _workerUseCase: WorkerUsecase;

  constructor(workerUsecase: WorkerUsecase) {
    this._workerUseCase = workerUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const verifyWorker = await this._workerUseCase.checkExist(
        email,
        phoneNumber
      );
      //   console.log("verifyWorker:", verifyWorker);

      if (verifyWorker.status === 200) {
        const worker = await this._workerUseCase.signup(
          name,
          email,
          password,
          phoneNumber
        );
        // console.log("worker:--", worker);

        return res
          .status(worker.status)
          .json({ message: worker.message, email: worker.email });
      }
      res.status(200).json(verifyWorker.message);
    } catch (error) {
      next(error);
    }
  }
  async otpVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const verified = await this._workerUseCase.verifyOtp(email, otp);
      console.log("verified:--", verified);

      if (verified.status === 200 && verified.token) {
        res.cookie("workerToken", verified.token, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        return res
          .status(verified.status)
          .json({ message: verified.message, user: verified.userData });
      } else {
        console.log("Verification failed:", verified.message);
        return res.status(verified.status).json({ message: verified.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("workerToken", "", {
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
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const verified = await this._workerUseCase.verfyLogin(email, password);

      if (verified.status === 200 && verified.token) {
        res.cookie("workerToken", verified.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
      }
      console.log("verified:", verified);

      return res.json({
        message: verified.message,
        worker: verified.worker,
      });
    } catch (error) {
      next(error);
    }
  }

  async services(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await this._workerUseCase.services();
      // console.log('services---touched',services);
      return res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }
}

export default WorkerController;
