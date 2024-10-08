import jwt, { JwtPayload } from "jsonwebtoken";
import JWT from "../../use-cases/interfaces/users/Ijwt";
import { REFRESH_KEY, SECRET_KEY } from "../constants/env";
import { ITokens } from "../../use-cases/interfaces/users/ITokens";
import logger from "../config/logger";
import { CostumeError } from "../middlewares/customError";
import { ObjectId } from "mongoose";

class JWTService implements JWT {
  generateToken(id: string, role: string): ITokens {
    try {
      // console.log("-----generateToken--:",role,'<-->',id);
      if (!id) {
        console.log("generateToken not get id");

        throw Error("generateToken not get id");
      }
      if (!role) {
        console.log("generateToken not get role");

        throw Error("generateToken not get role");
      }
      const tokenPayload = { id, role };
      const accessToken = jwt.sign(tokenPayload, SECRET_KEY);
      const refreshToken = jwt.sign({ id, role }, REFRESH_KEY);
 
      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error);
      throw error;
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
    // console.log("verifyToken:-", token);
    try {
      if (SECRET_KEY) {
        // console.log('iam secret key',SECRET_KEY,'ism tokrn',token)
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        // console.log('iam decoded',decoded)
        return { success: true, decoded };
      }
    } catch (error) {
      console.log("verifyToken:- error---", error);
    }
    return null;
  }
}

export default JWTService;
