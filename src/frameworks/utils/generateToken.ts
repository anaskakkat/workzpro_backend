import jwt from "jsonwebtoken";
import JWT from "../../use-cases/interfaces/users/Ijwt";
import { SECRET_KEY } from "../constants/env";

class JWTService implements JWT {
  generateToken(userId: string | undefined, email: string): string {
    try {
      if (!SECRET_KEY) {
        throw new Error("Secret key is not defined");
      }

      const payload = { userId, email };
      return jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });
    } catch (error) {
      console.error("Error generating token:", error);
      throw new Error("Failed to generate token");
    }
  }
}

export default JWTService;
