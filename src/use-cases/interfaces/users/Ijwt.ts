import { ITokens } from "./ITokens";

interface JWT {
  generateToken(userId: string | undefined, email: string): ITokens;
}

export default JWT;
