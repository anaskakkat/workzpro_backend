import GenerateOtp from "../frameworks/utils/generateOtp";
import UserRepository from "../repository/userRepository";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
class UserUsecase {
  private _userRepository: UserRepository;
  private _generateOtp: GenerateOtp;
  private _encryptOtp: EncryptOtp;
  private _encryptPassword: EncryptPassword;
  private _emailService: NodemailerEmailService;

  constructor(
    userRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptOtp: EncryptOtp,
    encryptPassword: EncryptPassword,
    emailService: NodemailerEmailService
  ) {
    this._userRepository = userRepository;
    this._generateOtp = generateOtp;
    this._encryptOtp = encryptOtp;
    this._encryptPassword = encryptPassword;
    this._emailService = emailService;
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

      await this._emailService.sendEmail(email,otp);

      return { status: 200, message: "Verification OTP sent to your email" };
    } catch (error) {
      console.error(error);
      return { status: 400, message: "An error occurred" };
    }
  }
}

export default UserUsecase;
