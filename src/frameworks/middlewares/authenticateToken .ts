import { Request, Response, NextFunction } from "express";
import JWTService from "../utils/generateToken";
import UserRepository from "../../repository/userRepository";
import { CostumeError } from "./customError";

const _jwtToken = new JWTService();
const _userRepo = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userToken = req.cookies.user_access_token;
  const userRefreshTokens = req.cookies.user_refresh_token;

  // console.log("---userToken--:",userToken);
// console.log("---userRefreshTokens--:",userRefreshTokens);



  if (!userRefreshTokens) {
    return next(new CostumeError(401, "Not authorized, no refresh token"));
  }

  if (!userToken) {
    try {
      console.log('i dont have access ')
      const newUserToken = await refreshAccessToken(userRefreshTokens);
      res.cookie("user_access_token", newUserToken, {
        maxAge: 15*60* 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      });
      userToken = newUserToken;
    } catch (error) {
      return next(new CostumeError(401, "Failed to refresh access token"));
    }
  }

  try {
    const decodedData = _jwtToken.verifyToken(userToken);
    // console.log("--user--decodedData--:", decodedData);
    if (!decodedData?.success) {
      return next(new CostumeError(401, "Invalid token!!"));
    }

    const user = await _userRepo.findUserById(decodedData.decoded.id);
    if (!user) {
      return next(new CostumeError(401, "User not found"));
    }
    if (user.isBlocked) {
      return next(new CostumeError(401, "You are blocked by admin"));
    }
    if (!decodedData.decoded.role || decodedData.decoded.role !== "user") {
      return next(new CostumeError(401, "Not authorized, invalid role"));
    }

    req.userId = decodedData.decoded.userId;
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
    // console.log('refreshAccessToken---decoded-----',decoded);
    
    const {accessToken} = _jwtToken.generateToken( 
      decoded.decoded.id,
      decoded.decoded.role
    );
    return accessToken;
  } catch (error) {
    throw new CostumeError(401, "Invalid refresh token");
  }
};

export default authenticateToken;
