import GenerateOtp from "../frameworks/utils/generateOtp";
import UserRepository from "../repository/userRepository";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import { log } from "console";
import JWTService from "../frameworks/utils/generateToken";
class UserUsecase {
  private _userRepository: UserRepository;
  private _generateOtp: GenerateOtp;
  private _encryptOtp: EncryptOtp;
  private _encryptPassword: EncryptPassword;
  private _emailService: NodemailerEmailService;
  private _genrateToken: JWTService;

  constructor(
    userRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptOtp: EncryptOtp,
    encryptPassword: EncryptPassword,
    emailService: NodemailerEmailService,
    generateToken: JWTService
  ) {
    this._userRepository = userRepository;
    this._generateOtp = generateOtp;
    this._encryptOtp = encryptOtp;
    this._encryptPassword = encryptPassword;
    this._emailService = emailService;
    this._genrateToken = generateToken;
  }

  async checkExist(email: string, phoneNumber: number) {
    try {
      const userExist = await this._userRepository.findbyEmail(email);
      const phoneNumberExist = await this._userRepository.findPhoneNumber(
        phoneNumber
      );

      if (userExist) {
        return { status: 400, message: "User Already Exists" };
      }
      if (phoneNumberExist) {
        return { status: 400, message: "Phone Number Exists" };
      }
      return { status: 200, message: "User Does Not Exist" };
    } catch (error) {
      console.error(error); // Improved error logging
      return { status: 400, message: "An error occurred" };
    }
  }

  async signup(
    userName: string,
    email: string,
    password: string,
    phoneNumber: number
  ) {
    try {
      const otp = this._generateOtp.createOtp();
      console.log("Otp:", otp);

      const hashedOtp = await this._encryptOtp.encrypt(otp);
      const hashedPassword = await this._encryptPassword.encrypt(password);
      const user = {
        userName,
        email,
        phoneNumber,
        password: hashedPassword,
      };
      await this._userRepository.saveOtp(email, hashedOtp);
      await this._userRepository.saveUserDataTemp(user);
      await this._emailService.sendEmail(email, otp);

      return {
        status: 200,
        message: "Verification OTP sent to your email",
        email: email,
      };
    } catch (error) {
      console.error(error);
      return { status: 400, message: "An error occurred" };
    }
  }
  async verifyOtp(email: string, otp: number) {
    try {
      const otpData = await this._userRepository.findOtpByEmail(email);
      // console.log("otpData:", otpData);

      if (!otpData) return { status: 400, messsage: "Invalid OTP" };

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      // if (now - otpGeneratedAt > otpExpiration) {
      //   await this._userRepository.deleteOtpByEmail(email);
      //   return { status: 400, message: "OTP has expired" };
      // }
      const isOtpValid = await this._encryptOtp.compare(otp, otpData.otp);
      if (!isOtpValid) {
        return { status: 400, message: "Invalid OTP" };
      }
      const userData = await this._userRepository.findNonVerifiedUserByEmail(
        email
      );
      console.log("userData", userData);

      if (!userData)
        return {
          status: 404,
          message: "User data not found in non-verified collection",
        };

      const user = {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        status: "verified",
      };
      const savedUser = await this._userRepository.saveVerifiedUser(user);
      if (!savedUser) {
        return { status: 500, message: "Failed to save user" };
      }
      await this._userRepository.deleteNonVerifiedUserByEmail(email);

      const token = this._genrateToken.generateToken(
        savedUser._id,
        savedUser.email
      );
      console.log("token:", token);

      return {
        status: 200,
        savedUser,
        message: "Welcome to WorkzPro!",
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "An error occurred while verifying OTP",
      };
    }
  }

  async resendOtp(email: string) {
    try {
      const otp = this._generateOtp.createOtp();
      await this._emailService.sendEmail(email, otp);

      console.log(otp);
      return {
        status: 200,
        data: {
          message: "Resend otp successfully sended",
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: "An error occurred while verifying OTP",
      };
    }
  }
}

export default UserUsecase;
