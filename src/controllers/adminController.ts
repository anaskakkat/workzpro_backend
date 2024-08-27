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
    try {
      const { email, password } = req.body;
      const verified = await this._adminUsecase.verifylogin(email, password);
      // console.log("admin:", verified);
      if (
        verified?.status === 200 &&
        verified?.tokens?.accessToken &&
        verified.tokens.refreshToken
      ) {
        res.cookie("admin_access_token", verified.tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.cookie("admin_refresh_token", verified.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
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
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._adminUsecase.userData();
      return res
        .status(result.status)
        .json({ message: result.message, data: result.userdata });
    } catch (error) {
      next(error);
    }
  }
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const result = await this._adminUsecase.blockuser(userId);
      return res
        .status(result.status)
        .json({ message: result.message, data: result.userdata });
    } catch (error) {
      next(error);
    }
  }
  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      // console.log("uid-", userId);

      const result = await this._adminUsecase.unblockUser(userId);
      return res
        .status(result.status)
        .json({ message: result.message, data: result.userdata });
    } catch (error) {
      next(error);
    }
  }
  async createServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const result = await this._adminUsecase.createServices(name, description);

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._adminUsecase.getServices();
      // console.log("re", result);

      res.status(result.status).json({
        message: result.message,
        service: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
  async blockServices(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._adminUsecase.blockServices(req.params.id);
      // console.log("re", result);

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  async unblockServices(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._adminUsecase.unblockServices(req.params.id);

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  async editServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const result = await this._adminUsecase.editServices(
        id,
        name,
        description
      );

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWorkers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._adminUsecase.getWorkers();
      // console.log("re", result);

      res.status(result.status).json({
        message: result.message,
        workers: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async blockWorker(req: Request, res: Response, next: NextFunction) {
    try {
      const WorkerId = req.params.id;
      const result = await this._adminUsecase.blockWorker(WorkerId);

      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  }
  async unblockWorker(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      // console.log("uid-", userId);

      const result = await this._adminUsecase.unblockWorker(userId);
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  }
  async worker_request(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      // console.log("uid-", userId);

      const result = await this._adminUsecase.worker_request(userId);
      // console.log('result:',result);

      return res
        .status(result.status)
        .json({ message: result.message, data: result.userdata });
    } catch (error) {
      next(error);
    }
  }
  async requestReject(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.params.id;
      console.log("uid-", workerId, "req.body", req.body);

      const result = await this._adminUsecase.requestReject(
        workerId,
        req.body.reason
      );
      // console.log('result:',result);

      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
