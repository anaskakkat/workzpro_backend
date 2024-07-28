import Otp from "../entities/otp";
import Worker from "../entities/worker";
import NonVerifyWorkerModel from "../frameworks/models/nonVerifyWorker";
import OtpModel from "../frameworks/models/otpModel";
import IworkerRepo from "../use-cases/interfaces/workers/IworkerRepo";
import worker from "../frameworks/models/workerModel";

class WorkerRepository implements IworkerRepo {
  async findWorkerByEmail(email: string) {
    return worker.findOne({ email: email }).exec();
  }
  async findWorkerPhoneNumber(phoneNumber: number) {
    return worker.findOne({ phoneNumber: phoneNumber }).exec();
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
        console.error('Error saving/updating non-verified worker data:', error);
        throw new Error('Failed to save or update non-verified worker data.');
      }
    }
  }
  

export default WorkerRepository;
