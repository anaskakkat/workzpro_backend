import GenerateOtp from "../frameworks/utils/generateOtp";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import JWTService from "../frameworks/utils/generateToken";
import WorkerRepository from "../repository/workerRepository";
class WorkerUsecase {
  private _WorkerRepository: WorkerRepository;

  private _generateOtp: GenerateOtp;
  private _encryptOtp: EncryptOtp;
  private _encryptPassword: EncryptPassword;
  private _emailService: NodemailerEmailService;
  private _genrateToken: JWTService;

  constructor(
    workRepository: WorkerRepository,
    generateOtp: GenerateOtp,
    encryptOtp: EncryptOtp,
    encryptPassword: EncryptPassword,
    emailService: NodemailerEmailService,
    generateToken: JWTService
  ) {
    this._WorkerRepository = workRepository;

    this._generateOtp = generateOtp;
    this._encryptOtp = encryptOtp;
    this._encryptPassword = encryptPassword;
    this._emailService = emailService;
    this._genrateToken = generateToken;
  }
  async checkExist(email: string, phoneNumber: number) {
    try {
      const workerExist = await this._WorkerRepository.findWorkerByEmail(email);
      const phoneNumberExist =
        await this._WorkerRepository.findWorkerPhoneNumber(phoneNumber);

      if (workerExist) {
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
    name: string,
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
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      };
      console.log("touched-------", user);

      await this._WorkerRepository.saveOtp(email, hashedOtp);
      await this._WorkerRepository.saveWorkerDataTemp(user);
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
      console.log(email, "-", otp);

      const otpData = await this._WorkerRepository.findOtpByEmail(email);
      console.log("otpData:", otpData);

      if (!otpData) return { status: 400, message: "Invalid OTP" };

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      if (now - otpGeneratedAt > otpExpiration) {
        await this._WorkerRepository.deleteOtpByEmail(email);
        return { status: 400, message: "OTP has expired" };
      }
      const isOtpValid = await this._encryptOtp.compare(otp, otpData.otp);
      if (!isOtpValid) {
        return { status: 400, message: "Invalid OTP" };
      }
      const userData =
        await this._WorkerRepository.findNonVerifiedWorkerByEmail(email);
      console.log("userData", userData);

      if (!userData)
        return {
          status: 404,
          message: "User data not found in non-verified collection",
        };

      const worker = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        status: "verified",
      };
      let savedUser = await this._WorkerRepository.saveVerifiedWorker(worker);
      if (!savedUser) {
        return { status: 500, message: "Failed to save user" };
      }
      await this._WorkerRepository.deleteNonVerifiedWorkerByEmail(email);

      const token = this._genrateToken.generateToken(
        savedUser._id,
      );
      // console.log("token:", token);

      return {
        status: 200,
        userData: {
          email: savedUser.email,
          username: savedUser.name,
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
  async verfyLogin(email: string, password: string) {
    console.log(email, "-", password);

    const user = await this._WorkerRepository.findWorkerByEmail(email);
    if (!user) {
      // console.log("User not found");
      return {
        statu: 400,
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
    const token = this._genrateToken.generateToken(user._id);
    console.log("token:", token);

    return {
      status: 200,
      user: {
        email: user.email,
        username: user.name,
        phone: user.phoneNumber,
      },
      message: "User Login Successfully",
      token,
    };
  }
}

export default WorkerUsecase;
