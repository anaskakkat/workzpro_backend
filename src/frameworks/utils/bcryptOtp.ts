import Encrypt from "../../use-cases/interfaces/users/Iencrypt";

import bcrypt from "bcrypt";

class EncryptOtp implements Encrypt {
  async encrypt(otp: string | number): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(otp.toString(), salt);
    return hash;
  }

  async compare(otp: string | number, hashedOtp: string): Promise<boolean> {
    return await bcrypt.compare(otp.toString(), hashedOtp);
  }
}

export default EncryptOtp;
