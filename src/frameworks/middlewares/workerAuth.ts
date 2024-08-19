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

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let workerToken = req.cookies.worker_token;
  const workerRefreshTokens = req.cookies.worker_refresh_token;

  if (!workerRefreshTokens) {
    return next(new CostumeError(401, "Not authorized, no refresh token"));
  }

  if (!workerToken) {
    try {
      console.log("i dont have access ");
      const newWorkerToken = await refreshAccessToken(workerRefreshTokens);
      res.cookie("worker_token", newWorkerToken, {
        maxAge: 15 * 60 * 60 * 1000,
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
    // console.log("decodedData:", decodedData);
    if (!decodedData?.success) {
      return next(new CostumeError(401, "Invalid token!!"));
    }

    const worker = await _WorkerRepo.findWorkerById(
      decodedData.decoded.WorkerId
    );
    if (!worker) {
      return next(new CostumeError(401, "Worker not found"));
    }
    if (worker.isBlocked) {
      return next(new CostumeError(401, "You are blocked by admin"));
    }
    if (!decodedData.decoded.role || decodedData.decoded.role !== "Worker") {
      return next(new CostumeError(401, "Not authorized, invalid role"));
    }

    req.WorkerId = decodedData.decoded.workerId;
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
    const { accessToken } = _jwtToken.generateToken(
      decoded.decoded.workerId,
      decoded.decoded.role
    );
    return accessToken;
  } catch (error) {
    throw new CostumeError(401, "Invalid refresh token");
  }
};

export default authenticateToken;
