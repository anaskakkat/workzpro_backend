import GenerateOtp from "../frameworks/utils/generateOtp";
import UserRepository from "../repository/userRepository";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import JWTService from "../frameworks/utils/generateToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../frameworks/config/logger";
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
      console.log("phoneNumber", phoneNumber);

      const userExist = await this._userRepository.findUserByEmail(email);
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
      console.error(error);
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
      // console.log(email,'-',otp);

      const otpData = await this._userRepository.findOtpByEmail(email);
      // console.log("otpData:", otpData);

      if (!otpData) return { status: 400, messsage: "Invalid OTP" };

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      if (now - otpGeneratedAt > otpExpiration) {
        await this._userRepository.deleteOtpByEmail(email);
        return { status: 400, message: "OTP has expired" };
      }
      const isOtpValid = await this._encryptOtp.compare(otp, otpData.otp);
      if (!isOtpValid) {
        return { status: 400, message: "Invalid OTP" };
      }
      const userData = await this._userRepository.findNonVerifiedUserByEmail(
        email
      );
      // console.log("userData", userData);

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
      let savedUser = await this._userRepository.saveVerifiedUser(user);
      if (!savedUser) {
        return { status: 500, message: "Failed to save user" };
      }
      await this._userRepository.deleteNonVerifiedUserByEmail(email);

      const token = this._genrateToken.generateToken(savedUser._id);
      // console.log("token:", token);

      return {
        status: 200,
        userData: {
          email: savedUser.email,
          username: savedUser.userName,
          phone: savedUser.phoneNumber,
        },
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
      const hashedOtp = await this._encryptOtp.encrypt(otp);
      await this._userRepository.saveOtp(email, hashedOtp);
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
  async verfyLogin(email: string, password: string) {
    try {
      const user = await this._userRepository.findUserByEmail(email);
      if (!user) {
        // console.log("User not found");
        return {
          status: 400,
          message: "User not found",
        };
      }
      const isPasswordCorrect = await this._encryptPassword.compare(
        password,
        user.password
      );
      if (!isPasswordCorrect) {
        return {
          status: 400,
          message: "Password is incorrect",
        };
      }
      const tokens = this._genrateToken.generateToken(user._id);
      console.log("tokens--:", tokens);

      return {
        status: 200,
        user: {
          email: user.email,
          username: user.userName,
          phone: user.phoneNumber,
        },
        message: "User Login Successfully",
        tokens,
      };
    } catch (error) {
      console.log(error);
      
      logger.info(error);
    }
  }

}

export default UserUsecase;
