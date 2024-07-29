import Otp from "../entities/otp";
import Worker from "../entities/worker";
import NonVerifyWorkerModel from "../frameworks/models/nonVerifyWorker";
import OtpModel from "../frameworks/models/otpModel";
import IworkerRepo from "../use-cases/interfaces/workers/IworkerRepo";
import workerModel from "../frameworks/models/workerModel";

class WorkerRepository implements IworkerRepo {
  async findWorkerByEmail(email: string) {
    console.log(email);
    
    return workerModel.findOne({ email: email }).exec();
  }
  async findWorkerPhoneNumber(phoneNumber: number) {
    return workerModel.findOne({ phoneNumber: phoneNumber }).exec();
  }
  async saveOtp(email: string, otp: string): Promise<Otp | null> {
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

  async saveWorkerDataTemp(user: Worker): Promise<Worker | null> {
    try {
      const filter = { email: user.email };
      const update = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      };
      const options = { upsert: true, new: true };

      const updatedWorker = await NonVerifyWorkerModel.findOneAndUpdate(
        filter,
        update,
        options
      ).exec();
      //   console.log('updatedWorker:-',updatedWorker);

      return updatedWorker;
    } catch (error) {
      console.error("Error saving/updating non-verified worker data:", error);
      throw new Error("Failed to save or update non-verified worker data.");
    }
  }async findOtpByEmail(email: string) {
    return OtpModel.findOne({ email: email });
  }
  async deleteOtpByEmail(email: string) {
    return OtpModel.deleteOne({ email: email });
  }
  async findNonVerifiedWorkerByEmail(email: string) {
    return NonVerifyWorkerModel.findOne({ email: email });
  }
  async saveVerifiedWorker(userData: any) {
    const verifiedUser = new workerModel(userData);
    return verifiedUser.save();
  }
  async deleteNonVerifiedWorkerByEmail(email: string) {
    return NonVerifyWorkerModel.deleteOne({ email: email });
  }
}

export default WorkerRepository;
