import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "../constants/env";
import JWTService from "../utils/generateToken";
import UserRepository from "../../repository/userRepository";

const _jwtToken = new JWTService();
const _userRepo = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  let userToken = req.cookies.user_access_token;
  const userRefreshTokens = req.cookies.user_refresh_token;

  if (!userRefreshTokens) {
    return res.status(401).json({ message: "Not authorized, no refresh token" });
  }

  if (!userToken) {
    try {
      const newUserToken = await refreshAccessToken(userRefreshTokens);
      res.cookie("user_access_token", newUserToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
      });
      userToken = newUserToken;
    } catch (error) {
      return res.status(401).json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const decodedData = _jwtToken.verifyToken(userToken);
    if (!decodedData?.success) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await _userRepo.findUserByEmail(decodedData.decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(401).json({ message: "You are blocked by admin!" });
    }
    if (!decodedData.decoded.role || decodedData.decoded.role !== "user") {
      return res.status(401).json({ message: "Not authorized, invalid role" });
    }
    
    req.userId = decodedData.decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const decoded = _jwtToken.verifyRefreshToken(refreshToken);
    const newAccessToken = _jwtToken.generateToken(decoded?.decoded.userId, decoded?.role);
    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export default authenticateToken;
