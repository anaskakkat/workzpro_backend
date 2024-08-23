import { NextFunction, Request, Response } from "express";
import WorkerUsecase from "../use-cases/workerUsecse";
import { NODE_ENV } from "../frameworks/constants/env";
import Slot from "../entities/slots";
import { log } from "console";

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
      // console.log("status checkking--------------------:", verifyWorker);

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
      // console.log("verified:--", verified);

      if (verified.status === 200 && verified.token) {
        res.cookie("worker_access_token", verified.token.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("worker_refresh_token", verified.token.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });

        return res
          .status(verified.status)
          .json({ message: verified.message, data: verified.userData });
      } else {
        // console.log("Verification failed:", verified.message);
        return res.status(verified.status).json({ message: verified.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("worker_access_token", "", {
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
        res.cookie("worker_access_token", verified.token.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 1000,
          // maxAge: 15 * 1000,
          sameSite: "strict",
        });
        res.cookie("worker_refresh_token", verified.token.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
      }
      // console.log("verified:", verified);

      return res.json({
        message: verified.message,
        worker: verified.worker,
      });
    } catch (error) {
      next(error);
    }
  }

  async addProblam(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("--data--", req.body);
      const { problemName, estimatedHours, workerId } = req.body;
      const newProblem = await this._workerUseCase.addProblam(
        problemName,
        estimatedHours,
        workerId
      );
      if (newProblem.status === 200) {
        return res.status(newProblem.status).json(newProblem.message);
      }
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
  async commonProblams(req: Request, res: Response, next: NextFunction) {
    try {
      const Problams = await this._workerUseCase.commonProblams(req.params.id);
      console.log("commonProblams---touched", Problams);
      return res.status(Problams.status).json(Problams);
    } catch (error) {
      next(error);
    }
  }
  async setProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('--req.body---',req.body);

      const profileData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updatedWorker = await this._workerUseCase.setProfile(
        profileData,
        files
      );
      res.status(200).json({ success: true, data: updatedWorker });
    } catch (error) {
      next(error);
    }
  }
  async setSlots(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("-controller-body--", req.body);
      // console.log("-controller-body--", req.params.id);

      const slotData: Slot = req.body;
      const updatedWorker = await this._workerUseCase.setSlots(
        slotData,
        req.params.id
      );
      return res.status(200).json({ success: true, data: updatedWorker });
    } catch (error) {
      next(error);
    }
  }
  async fetchSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const slots = await this._workerUseCase.fetchSlots(req.params.id);
      res.status(200).json({ success: true, data: slots });
    } catch (error) {
      next(error);
    }
  }
  async deleteSlot(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("i", req.params.id);
      const data = await this._workerUseCase.deleteSlot(req.params.id);
      return res.status(200).json({ message: "Slot SucussFully Deleted" });
    } catch (error) {
      next(error);
    }
  }
  async bookingAccept(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("i", req.params.id);
      const data = await this._workerUseCase.bookingAccept(req.params.id);
      return res.status(200).json({ message: "Booking Request Accepted" });
    } catch (error) {
      next(error);
    }
  }
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, picture, googleId } = req.body;
      // console.log("-------------i------------------------",email,name );
      const verified = await this._workerUseCase.googleAuth(
        email,
        name,
        picture,
        googleId
      );
      console.log("--cntrl-data-", verified);
      if (
        verified?.status === 200 &&
        verified?.tokens?.accessToken &&
        verified.tokens.refreshToken
      ) {
        res.cookie("worker_access_token", verified.tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 15 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("worker_refresh_token", verified.tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        const workerData = {
          _id: verified.data._id,
          name: verified.data.name,
          email: verified.data.email,
          phoneNumber: verified.data.phoneNumber,
          wallet: verified.data.wallet,
          role: verified.data.role,
          isBlocked: verified.data.isBlocked,
          status: verified.data.status,
          createdAt: verified.data.createdAt,
          updatedAt: verified.data.updatedAt,
          profilePicture: verified.data.profilePicture,
        };
        return res.status(verified.status).json({
          message: verified.message,
          data: workerData,
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
}

export default WorkerController;
