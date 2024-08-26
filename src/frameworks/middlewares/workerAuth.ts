import { Request, Response, NextFunction } from "express";
import JWTService from "../utils/generateToken";
import { CostumeError } from "./customError";
import WorkerRepository from "../../repository/workerRepository";

const _jwtToken = new JWTService();
const _WorkerRepo = new WorkerRepository();

declare global {
  namespace Express {
    interface Request {
      WorkerId?: string;
    }
  }
}

const workerAuth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('path  ; ',req.path)
  let workerToken = req.cookies.worker_access_token;
  const workerRefreshTokens = req.cookies.worker_refresh_token;
  // console.log("---workerToken--:",workerToken);
  // console.log("---workerRefreshTokens--:",workerRefreshTokens);

  if (!workerRefreshTokens) {
    return next(new CostumeError(401, "Not authorized, no refresh token"));
  }

  if (!workerToken) {
    try {
      console.log("worker i dont have access tokan ");
      const newWorkerToken = await refreshAccessToken(workerRefreshTokens);
      // console.log('newWorkerToken:',newWorkerToken);

      res.cookie("worker_access_token", newWorkerToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      });
      workerToken = newWorkerToken;
    } catch (error) {
      return next(new CostumeError(401, "Failed to refresh access token"));
    }
  }

  try {
    const decodedData = _jwtToken.verifyToken(workerToken);
    // console.log("----decodedData---:", decodedData?.decoded);
    if (!decodedData?.success) {
      return next(new CostumeError(401, "Invalid token!!"));
    }

    const worker = await _WorkerRepo.findWorkerById(decodedData.decoded.id);
    // console.log("----worker---:", worker);

    if (!worker) {
      return next(new CostumeError(401, "Worker not found"));
    }
    if (worker.isBlocked) {
      return next(new CostumeError(401, "You are blocked by admin"));
    }
    if (!decodedData.decoded.role || decodedData.decoded.role !== "worker") {
      return next(new CostumeError(401, "Not authorized, invalid role"));
    }

    req.WorkerId = decodedData.decoded.workerId;
    // console.log('all set...')
    next();
  } catch (error) {
    return next(new CostumeError(401, "Authentication failed"));
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const decoded = await _jwtToken.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }

    // console.log("=refreshAccessToken-worker-decoded-",decoded);

    const { accessToken } = _jwtToken.generateToken(
      decoded.decoded.id,
      decoded.decoded.role
    );
    return accessToken;
  } catch (error) {
    throw new CostumeError(401, "Invalid refresh token");
  }
};

export default workerAuth;
