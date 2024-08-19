import Otp from "../../../entities/otp";
import User from "../../../entities/user";

interface  UserRepo {
  findUserByEmail(email: string): Promise<User | null>;
  findPhoneNumber(phoneNumber: number): Promise<User | null>;
  saveUserDataTemp(user: User): Promise<User| null>;
  saveOtp(email: string, otp: string): Promise<Otp | null>;
}

export default UserRepo;
