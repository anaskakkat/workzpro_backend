import { log } from "console";
import bcrypt from "bcrypt";

interface Encrypt {
  encrypt(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
class EncryptPassword implements Encrypt {
  async encrypt(password: string): Promise<string> {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    // console.log(password,'---',hashedPassword);

    return await bcrypt.compare(password, hashedPassword);
  }
}
export default EncryptPassword;
