import jwt, { JwtPayload } from "jsonwebtoken";
import JWT from "../../use-cases/interfaces/users/Ijwt";
import { REFRESH_KEY, SECRET_KEY } from "../constants/env";
import { ITokens } from "../../use-cases/interfaces/users/ITokens";
import logger from "../config/logger";

class JWTService implements JWT {
  generateToken(userId: string,role:string|undefined): ITokens {
    try {
      const accessToken = jwt.sign({ userId,role}, SECRET_KEY, {
        expiresIn: "10s",
      });
      const refreshToken = jwt.sign({ userId,role}, REFRESH_KEY, {
        expiresIn: "30d",
      });

      return { accessToken, refreshToken };
    } catch (error) {
      const err = error as Error;
      logger.error("Error generating token:", {
        message: err.message,
        stack: err.stack,
      });
      throw new Error("Failed to generate token");
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      if (REFRESH_KEY) {
        const decoded = jwt.verify(token, REFRESH_KEY) as JwtPayload;
        return { success: true, decoded };
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
    }
    return null;
  }
  verifyToken(token: string): JwtPayload | null {
    try {
      if (SECRET_KEY) {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return { success: true, decoded };
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

export default JWTService;
