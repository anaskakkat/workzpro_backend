import { Request, Response, NextFunction } from "express";
import JWTService from "../utils/generateToken";
import { CostumeError } from "./customError";
import AdminRepository from "../../repository/adminRepository";

const _jwtToken = new JWTService();
const _adminRepo = new AdminRepository();

// declare global {
//   namespace Express {
//     interface Request {
//       WorkerId?: string;
//     }
//   }
// }

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  let adminToken = req.cookies.admin_access_token;
  const adminRefreshTokens = req.cookies.admin_refresh_token;
  // console.log("--adminAuthToken--:", adminToken);
  // console.log("---adminAuthRefreshTokens--:", adminRefreshTokens);

  if (!adminRefreshTokens) {
    return next(new CostumeError(401, "Not authorized, no refresh token"));
  }

  if (!adminToken) {
    try {
      console.log(" adminAuth i dont have access ");
      const newAdminToken = await refreshAccessToken(adminRefreshTokens);
      //   console.log("newAdminToken:", newAdminToken);

      res.cookie("admin_access_token", newAdminToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      });
      adminToken = newAdminToken;
    } catch (error) {
      return next(new CostumeError(401, "Failed to refresh access token"));
    }
  }

  try {
    const decodedData = _jwtToken.verifyToken(adminToken);
    // console.log("----decodedData---:", decodedData?.decoded);
    if (!decodedData?.success) {
      return next(new CostumeError(401, "Invalid token!!"));
    }

    const admin = await _adminRepo.FindAdminById(decodedData.decoded.id);
    // console.log("----admin---:", admin);

    if (!admin) {
      return next(new CostumeError(401, "Admin not found"));
    }

    if (!decodedData.decoded.role || decodedData.decoded.role !== "admin") {
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

    // console.log("-refreshAccessToken-decoded-",decoded);

    const { accessToken } = _jwtToken.generateToken(
      decoded.decoded.id,
      decoded.decoded.role
    );
    return accessToken;
  } catch (error) {
    throw new CostumeError(401, "Invalid refresh token");
  }
};

export default adminAuth;
