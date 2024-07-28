import GenerateOtp from "../frameworks/utils/generateOtp";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import JWTService from "../frameworks/utils/generateToken";
import WorkerRepository from "../repository/workerReposotory";
class WorkerUsecase {
  private _WorkerRepository: WorkerRepository;

  private _generateOtp: GenerateOtp;
  private _encryptOtp: EncryptOtp;
  private _encryptPassword: EncryptPassword;
  private _emailService: NodemailerEmailService;
  //   private _genrateToken: JWTService;

  constructor(
    workRepository: WorkerRepository,
    generateOtp: GenerateOtp,
    encryptOtp: EncryptOtp,
    encryptPassword: EncryptPassword,
    emailService: NodemailerEmailService
    // generateToken: JWTService
  ) {
    this._WorkerRepository = workRepository;

    this._generateOtp = generateOtp;
    this._encryptOtp = encryptOtp;
    this._encryptPassword = encryptPassword;
    this._emailService = emailService;
    // this._genrateToken = generateToken;
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
      console.log('touched-------',user);
      
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
}

export default WorkerUsecase;
