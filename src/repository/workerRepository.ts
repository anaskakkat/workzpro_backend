import Otp from "../entities/otp";
import Worker from "../entities/worker";
import NonVerifyWorkerModel from "../frameworks/models/nonVerifyWorker";
import OtpModel from "../frameworks/models/otpModel";
import IworkerRepo from "../use-cases/interfaces/workers/IworkerRepo";
import workerModel from "../frameworks/models/workerModel";
import serviceModel from "../frameworks/models/serviceModel";
import WorkerModel from "../frameworks/models/workerModel";
import Slot from "../entities/slots";
import { Schema } from "mongoose";
import SlotModel from "../frameworks/models/slotsModel";

class WorkerRepository implements IworkerRepo {
  async findWorkerByEmail(email: string) {
    return workerModel.findOne({ email: email }).exec();
  }
  async findWorkerById(id: string) {
    return workerModel.findById(id).exec();
  }

  async updateWorkerById(workerId: string, updateData: any) {
    return WorkerModel.findByIdAndUpdate(workerId, updateData, { new: true });
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
  }
  async findOtpByEmail(email: string) {
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
  async getServices() {
    return serviceModel.find();
  }
  async saveSlots(slots: any, workerid: Schema.Types.ObjectId) {
    try {
      let slotDoc = await SlotModel.findOne({ workerId: workerid });
      // console.log(slotDoc);
      if (slotDoc) {
        slotDoc.slots.push(slots.data);
        slotDoc.isCreated = true;
      } else {
        slotDoc = new SlotModel({
          workerId: workerid,
          slots: [slots.data],
          isCreated: true,
        });
      }
      await slotDoc.save();
    } catch (error) {
      console.error("worker-repo", error);
      throw error;
    }
  }
  async getSlotsById(id: string) {
    try {
      const slots = SlotModel.findOne({ workerId: id });
      return slots;
    } catch (error) {
      throw error;
    }
  }
}

export default WorkerRepository;
