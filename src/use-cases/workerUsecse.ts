import GenerateOtp from "../frameworks/utils/generateOtp";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import JWTService from "../frameworks/utils/generateToken";
import WorkerRepository from "../repository/workerRepository";
import { CostumeError } from "../frameworks/middlewares/customError";
import uploadToCloudinary from "../frameworks/utils/ClouinaryUpload";
import Slot from "../entities/slots";
import { generateWorkerId } from "../frameworks/utils/generateId";
import WorkerModel from "../frameworks/models/workerModel";
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
        throw new CostumeError(400, "User Already Exists");
      }
      if (phoneNumberExist) {
        throw new CostumeError(400, "Phone Number Exists");
      }
      return { status: 200, message: "User Does Not Exist" };
    } catch (error) {
      console.error(error);
      throw error;
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
      // - worker id generator
      const workerId = generateWorkerId();
      // console.log("workerId:",  workerId);
      const worker = {
        workerId,
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      };
      // console.log("touched-------",  worker);

      await this._WorkerRepository.saveOtp(email, hashedOtp);
      await this._WorkerRepository.saveWorkerDataTemp(worker);
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
      console.log(email, "-", otp);

      const otpData = await this._WorkerRepository.findOtpByEmail(email);
      console.log("otpData:", otpData);

      if (!otpData) return { status: 400, message: "Invalid OTP" };

      const now = new Date().getTime();
      const otpGeneratedAt = new Date(otpData.otpGeneratedAt).getTime();
      const otpExpiration = 1 * 60 * 1000;

      // if (now - otpGeneratedAt > otpExpiration) {
      //   await this._WorkerRepository.deleteOtpByEmail(email);
      //   return { status: 400, message: "OTP has expired" };
      // }
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
          message: "worker data not found in non-verified collection",
        };

      const worker = {
        workerId: userData.workerId,
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
      console.log("--savedworker--------------------------------", savedUser);

      await this._WorkerRepository.deleteNonVerifiedWorkerByEmail(email);

      const token = this._genrateToken.generateToken(
        savedUser._id.toString(),
        savedUser.role as string
      );
      // console.log("token:", token);

      return {
        status: 200,
        userData: savedUser,
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
    try {
      // console.log("Attempting login with email:", email);

      const worker = await this._WorkerRepository.findWorkerByEmail(email);
      if (!worker) {
        throw new CostumeError(400, "Worker not found");
      }
      if (worker.isBlocked) {
        throw new CostumeError(400, "You are blocked... please contact Admin");
      }
      if (!worker.loginAccess) {
        throw new CostumeError(400, "Admin not verified yet");
      }
      const isPasswordCorrect = await this._encryptPassword.compare(
        password,
        worker.password
      );
      if (!isPasswordCorrect) {
        throw new CostumeError(400, "Password is incorrect");
      }
      // console.log("--savedworker---", worker);

      const token = this._genrateToken.generateToken(
        worker._id,
        worker.role as string
      );
      // console.log("worker token:", token);

      return {
        status: 200,
        worker: worker,
        message: "Login Successfully",
        token,
      };
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  async googleAuth(
    email: string,
    name: string,
    picture: string,
    googleId: string
  ) {
    try {
      const worker = await this._WorkerRepository.findWorkerByEmail(email);
      console.log("---worker---", worker);
      if (worker) {
        if (worker.isBlocked) {
          throw new CostumeError(400, "Sorry...., you are blocked!.");
        }
        if (!worker.loginAccess) {
          throw new CostumeError(
            400,
            "Sorry...., verification under proccessing!."
          );
        }
        const tokens = this._genrateToken.generateToken(
          worker._id,
          worker.role as string
        );
        return {
          status: 200,
          message: "Login Successful",
          tokens,
          data: worker,
        };
      } else {
        const hashedPassword = await this._encryptPassword.encrypt(googleId);

        const workerData = await this._WorkerRepository.createWorker({
          email,
          name,
          picture,
          hashedPassword,
        });
        const tokens = this._genrateToken.generateToken(
          workerData._id,
          workerData.role as string
        );
        return {
          status: 200,
          message: "worker login succes",
          data: workerData,
          tokens,
        };
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async services() {
    try {
      const services = this._WorkerRepository.getServices();
      if (!services) {
        throw new CostumeError(400, "not fetched service data");
      }
      return services;
    } catch (error) {
      throw error;
    }
  }
  async commonProblams(workerId: string) {
    try {
      const commonProblams = await this._WorkerRepository.commonProblams(
        workerId
      );
      if (!commonProblams) {
        throw new CostumeError(400, "not fetched commonProblams data");
      }
      return { commonProblams, status: 200, message: "fetched commonProblams" };
    } catch (error) {
      throw error;
    }
  }

  async setProfile(
    profileData: any,
    files: { [fieldname: string]: Express.Multer.File[] }
  ) {
    try {
      console.log("profileData::--", profileData);

      const worker = await this._WorkerRepository.findWorkerById(
        profileData.workerId
      );
      if (!worker) {
        throw new CostumeError(400, "Worker not found");
      }
      let profilePictureUrl: string | undefined;
      let identityProofUrl: string | undefined;

      if (files?.profilePic) {
        profilePictureUrl = await uploadToCloudinary(
          files.profilePic[0],
          "profile_pictures"
        );
      }

      if (files?.identityProof) {
        identityProofUrl = await uploadToCloudinary(
          files.identityProof[0],
          "identity_proofs"
        );
      }
      const parsedLocation = JSON.parse(profileData.location);
      // console.log("parsedLocation:", parsedLocation);

      const locationObj = {
        type: "Point",
        coordinates: [parsedLocation.lng, parsedLocation.lat],
      };

      const updatedWorker = await this._WorkerRepository.updateWorkerById(
        worker._id,
        {
          experience: profileData.experience,
          wageDay: profileData.wageDay,
          location: locationObj,
          service: profileData.service,
          profilePicture: profilePictureUrl,
          identityProof: identityProofUrl,
          locationName: profileData.locationName,
          workRadius: profileData.workRadius,
        }
      );
      // console.log("updatedWorker:", updatedWorker);

      return updatedWorker;
    } catch (error) {
      throw error;
    }
  }
  async setSlots(slotData: Slot, Workerid: string): Promise<any> {
    try {
      const savedSlot: any = await this._WorkerRepository.saveSlots(
        slotData,
        Workerid
      );
      console.log("slotData::----------------------:", savedSlot);
      await this._WorkerRepository.workerUpdateSlotsId(Workerid, savedSlot._id);

      // console.log('savedSlot:',savedSlot);

      return savedSlot;
    } catch (error) {
      console.error("Error setting slots:", error);
      throw error;
    }
  }
  async fetchSlots(id: string): Promise<any> {
    try {
      const slots = await this._WorkerRepository.getSlotsById(id);
      if (slots) {
        return slots;
      } else {
        throw new CostumeError(400, "no slots");
      }
    } catch (error) {
      console.error("Error setting slots:", error);
      throw error;
    }
  }
  async deleteSlot(id: string): Promise<any> {
    try {
      const slots = await this._WorkerRepository.deleteSlot(id);
      console.log("slots:", slots);

      if (slots) {
        return slots;
      } else {
        new CostumeError(400, "fething slots an error");
      }
    } catch (error) {
      console.error("Error setting slots:", error);
      throw error;
    }
  }
  async bookingAccept(id: string): Promise<any> {
    try {
      const booking = await this._WorkerRepository.bookingAccept(id);
      // console.log('booking---:',booking);
      if (!booking) {
        throw new CostumeError(400, "Booking not found");
      }
      return booking;
    } catch (error) {
      console.error("Error setting slots:", error);
      throw error;
    }
  }
  async addProblam(
    problemName: string,
    estimatedHours: string,
    workerId: string
  ) {
    try {
      const newProblem = await this._WorkerRepository.saveAddProblam(
        problemName,
        estimatedHours,
        workerId
      );
      // console.log('newProblem---:',newProblem);
      if (!newProblem) {
        throw new CostumeError(400, "newProblem not creted");
      }
      return {
        status: 200,
        message: "New Problem Created",
      };
    } catch (error) {
      console.error("Error setting slots:", error);
      throw error;
    }
  }
}

export default WorkerUsecase;
