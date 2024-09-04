import { NextFunction, Request, Response } from "express";
import WorkerUsecase from "../use-cases/workerUsecse";
import { NODE_ENV } from "../frameworks/constants/env";
import Slot from "../entities/slots";
import { log } from "console";
import { CostumeError } from "../frameworks/middlewares/customError";

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
      res.cookie("worker_refresh_token", "", {
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

  async workingdays(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("workingdays-----", req.body);
      const updateWorker = await this._workerUseCase.workingdays(
        req.params.id,
        req.body
      );
      return res.status(updateWorker.status).json({
        message: updateWorker.message,
        data: updateWorker.updatedWorker,
      });
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
      // console.log("--cntrl-data-", verified);
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

  async getWorker(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("worker---touched");
      const worker = await this._workerUseCase.getWorker(req.params.id);
      // console.log("worker---touched", worker);
      return res.status(worker.status).json(worker);
    } catch (error) {
      next(error);
    }
  }

  async addService(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("-controller-body--");
      // console.log("-controller-body--", req.params.id);

      const updatedWorker = await this._workerUseCase.addService(
        req.params.id,
        req.body
      );
      console.log("updatedWorker---", updatedWorker);

      return res.status(200).json({ data: updatedWorker });
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("-controller-body--", req.params.id);
      // console.log("-controller-body--", req.body.serviceId);

      const data = await this._workerUseCase.deleteService(
        req.params.id,
        req.body.serviceId
      );
      // console.log("service---", service);

      return res.status(data.status).json({ data: data.message });
    } catch (error) {
      next(error);
    }
  }
  async editServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("-controller-body--", req.params.id);
      console.log("-controller-body--", req.body.serviceId);
      console.log("-controller-body--", req.body.data);

      const data = await this._workerUseCase.editServices(
        req.params.id,
        req.body.serviceId,
        req.body.data
      );
      // console.log("data---", data);

      return res.status(data.status).json({ data: data.message });
    } catch (error) {
      next(error);
    }
  }

  async allServices(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("allServices---touched");
      const services = await this._workerUseCase.services();
      // console.log('services---touched',services);
      return res.status(200).json(services);
      //
    } catch (error) {
      console.error("errorr allService,", error);
      next(error);
    }
  }

  async service(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("-controller-body--", req.params.id);

      const service = await this._workerUseCase.service(req.params.id);
      // console.log("service---", service);

      return res.status(200).json({ data: service });
    } catch (error) {
      next(error);
    }
  }
  async addLeave(req: Request, res: Response, next: NextFunction) {
    try {
      //  console.log("addLeave---", req.params.id);
      // console.log("addLeave---", req.body);
      const leave = await this._workerUseCase.addLeave(req.params.id, req.body);
      return res.status(200).json({ leave });
    } catch (error) {
      next(error);
    }
  }
  async getLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const leave = await this._workerUseCase.getLeave(req.params.id);
      // console.log("service---", leave);

      return res.status(200).json({ data: leave });
    } catch (error) {
      next(error);
    }
  }
  async deleteLeave(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("deleteLeave---", req.params.id);
      // console.log("deleteLeave---", req.body.leaveId);

      const leave = await this._workerUseCase.deleteLeave(
        req.params.id,
        req.body.leaveId
      );

      return res.status(200).json({ data: leave });
    } catch (error) {
      next(error);
    }
  }
  async bookings(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("bookings---", req.params.id);

      const bookings = await this._workerUseCase.bookings(req.params.id);

      return res.status(bookings.status).json(bookings.bookings);
    } catch (error) {
      next(error);
    }
  }
  async acceptBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await this._workerUseCase.acceptBooking(req.params.id);
      // console.log("bookings---", bookings);
      return res.status(bookings.status).json(bookings.message);
    } catch (error) {
      next(error);
    }
  }
  async rejectBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await this._workerUseCase.rejectBooking(req.params.id);
      // console.log("bookings---", bookings);
      return res.status(bookings.status).json(bookings.message);
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("update worker---", req.params.id);
      const profilePic = req.file;
      // console.log("update worker---", profilePic);
      // console.log("update worker---", req.body);
      if (profilePic) {
        const profile = await this._workerUseCase.updateProfile(
          req.params.id,
          req.body,
          profilePic
        );
        if (!profile) {
          throw new CostumeError(400, "not updated profile");
        }
        // console.log("--profile-cntrlr--", profile);
        return res.status(profile.status).json(profile.message);
      } else {
        const profile = await this._workerUseCase.updateProfilewithoutPicture(
          req.params.id,
          req.body
        );
        if (!profile) {
          throw new CostumeError(400, "not updated profile");
        }
        return res.status(profile.status).json(profile.message);

        // console.log("--profile-cntrlr- withouit picture-", profile);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default WorkerController;
