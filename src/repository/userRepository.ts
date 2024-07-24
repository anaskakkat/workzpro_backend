import User from "../entities/user";
import Otp from "../entities/otp";
import OtpModel from "../frameworks/models/otpModel";
import NonUserModel from "../frameworks/models/nonVerifyUser";
import UserModel from "../frameworks/models/userModel";
import UserRepo from "../use-cases/interfaces/users/IuserRepo";

class UserRepository implements UserRepo {
  async findbyEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: email }).exec();
  }

  async findPhoneNumber(phoneNumber: number): Promise<User | null> {
    return UserModel.findOne({ phoneNumber: phoneNumber }).exec();
  }

  async saveUserDataTemp(user: User): Promise<User | null> {
    const filter = { email: user.email };
    const update = {
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
    };
    const options = {
      upsert: true,
      new: true,
    };
    try {
      return await NonUserModel.findOneAndUpdate(filter, update, options).exec();
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }

  async saveOtp(email: string, otp: string): Promise<any> {
    const filter = { email };
    const update: any = {
      email,
      otp,
      otpGeneratedAt: new Date(),
    };
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };
    try {
      return await OtpModel.findOneAndUpdate(filter, update, options).exec();
    } catch (error) {
      throw new Error("Failed to save OTP.");
    }
  }
}

export default UserRepository;
