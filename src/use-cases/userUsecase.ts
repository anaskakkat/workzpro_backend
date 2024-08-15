import GenerateOtp from "../frameworks/utils/generateOtp";
import UserRepository from "../repository/userRepository";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import JWTService from "../frameworks/utils/generateToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../frameworks/config/logger";
import { CostumeError } from "../frameworks/middlewares/customError";
import { ObjectId } from "mongoose";
import bookingModel from "../frameworks/models/bookingsModel";
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
      throw error;
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
      throw error;
    }
  }
  async verifyOtp(email: string, otp: number) {
    try {
      // console.log(email,'-',otp);

      const otpData = await this._userRepository.findOtpByEmail(email);
      // console.log("otpData:", otpData);

      if (!otpData) throw new CostumeError(400, "Invalid OTP");

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      if (now - otpGeneratedAt > otpExpiration) {
        await this._userRepository.deleteOtpByEmail(email);
        throw new CostumeError(400, "OTP has expired");
      }
      const isOtpValid = await this._encryptOtp.compare(otp, otpData.otp);
      if (!isOtpValid) {
        throw new CostumeError(400, "Invalid OTP");
      }
      const userData = await this._userRepository.findNonVerifiedUserByEmail(
        email
      );
      console.log("userData", userData);

      if (!userData)
        throw new CostumeError(
          404,
          "User data not found in non-verified collection"
        );

      const user = {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        status: "verified",
      };
      let savedUser = await this._userRepository.saveVerifiedUser(user);
      if (!savedUser) {
        throw new CostumeError(500, "Failed to save user");
      }
      await this._userRepository.deleteNonVerifiedUserByEmail(email);

      console.log("savedUser:---", savedUser);
      const token = this._genrateToken.generateToken(
        savedUser._id,
        savedUser.role as string
      );

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
      throw error;
    }
  }

  async resendOtp(email: string) {
    try {
      const otp = this._generateOtp.createOtp();
      const hashedOtp = await this._encryptOtp.encrypt(otp);
      await this._userRepository.saveOtp(email, hashedOtp);
      await this._emailService.sendEmail(email, otp);

      console.log("Resnd_OTP:--", otp);
      return {
        status: 200,
        data: {
          message: "Resend otp successfully sended",
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async verfyLogin(email: string, password: string) {
    try {
      const user = await this._userRepository.findUserByEmail(email);
      // console.log("------", user);
      if (user?.isBlocked) {
        return {
          status: 400,
          message: "Sorry...., you are blocked!.",
        };
      }
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
      // console.log("user:---",user);

      const tokens = this._genrateToken.generateToken(
        user._id,
        user.role as string
      );
      // console.log("tokens--:", tokens);

      return {
        status: 200,
        user: user,
        message: "User Login Successfully",
        tokens,
      };
    } catch (error) {
      console.log(error);

      logger.info(error);
    }
  }
  async services() {
    try {
      const services = this._userRepository.getServices();
      if (!services) {
        throw new CostumeError(400, "not fetched service data");
      }
      return services;
    } catch (error) {
      throw error;
    }
  }
  async fetchWorkers() {
    try {
      const Workers = this._userRepository.fetchWorkers();
      if (!Workers) {
        throw new CostumeError(400, "not fetched Workers data");
      }

      return Workers;
    } catch (error) {
      throw error;
    }
  }
  async fetchWorkerByID(id: string) {
    try {
      const Workers = await this._userRepository.fetchWorkerByID(id);
      if (!Workers) {
        throw new CostumeError(400, "not fetched Workers data");
      }

      return Workers;
    } catch (error) {
      throw error;
    }
  }
  async fetchSlotById(id: string) {
    try {
      const slot = await this._userRepository.fetchSlotById(id);
      if (!slot) {
        throw new CostumeError(400, "not fetched slot data");
      }
      // console.log('slot---touched',slot);

      return slot;
    } catch (error) {
      throw error;
    }
  }
  async booking(userId: string, data: any) {
    try {
      const bookingData = await this._userRepository.saveBooking(userId, data);
      console.log("slot--data::", bookingData);

      return bookingData;
    } catch (error) {
      throw error;
    }
  }
}

export default UserUsecase;
