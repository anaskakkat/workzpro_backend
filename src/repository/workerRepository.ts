import Otp from "../entities/otp";
import Worker, { Configuration, Leave, Services } from "../entities/worker";
import NonVerifyWorkerModel from "../frameworks/models/nonVerifyWorker";
import OtpModel from "../frameworks/models/otpModel";
import IworkerRepo from "../use-cases/interfaces/workers/IworkerRepo";
import workerModel from "../frameworks/models/workerModel";
import serviceModel from "../frameworks/models/serviceModel";
import WorkerModel from "../frameworks/models/workerModel";

import Service from "../entities/services";

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
        workerId: user.workerId,
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
  async createWorker(worker: {
    name: String;
    email: string;
    picture: string;
    hashedPassword: string;
  }) {
    try {
      const workerData = new WorkerModel({
        email: worker.email,
        name: worker.name,
        profilePicture: worker.picture,
        password: worker.hashedPassword,
        status: "verified",
      });
      // console.log("---workerData:--", workerData);
      const data = await workerData.save();
      // console.log("---workerData:--", data);
      return data;
    } catch (error) {
      console.error("Failed to save or update google auth worker data:", error);
      throw new Error("Failed to save or update google auth worker data.");
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


  async saveWorkingDays(workerId: string, configuration: Configuration) {
    try {
      // console.log(workerId, "---", configuration);
      return await WorkerModel.findByIdAndUpdate(
        workerId,
        {
          $set: {
            "configuration.workingDays": configuration.workingDays,
            "configuration.slotSize": configuration.slotSize,
            "configuration.bufferTime": configuration.bufferTime,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async addService(workerId: string, serviceData: Services) {
    try {
      // console.log(serviceData);
      return await WorkerModel.findByIdAndUpdate(
        workerId,
        {
          $push: {
            "configuration.services": serviceData,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteServiceById(workerId: string, serviceId: string) {
    try {
      // console.log(serviceData);
      return await WorkerModel.findByIdAndUpdate(
        workerId,
        {
          $pull: {
            "configuration.services": { _id: serviceId },
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async editServices(workerId: string, serviceId: string, data: Service) {
    try {
      return await WorkerModel.findOneAndUpdate(
        { _id: workerId, "configuration.services._id": serviceId },
        {
          $set: {
            "configuration.services.$": { ...data, _id: serviceId },
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async addLeave(workerId: string, data: Leave) {
    try {
      // console.log('datee----',data);
      return await WorkerModel.findByIdAndUpdate(
        workerId,
        {
          $push: {
            "configuration.leaves": data,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async deleteLeavesById(workerId: string, leaveId: string) {
    try {
      // console.log(serviceData);
      return await WorkerModel.findByIdAndUpdate(
        workerId,
        {
          $pull: {
            "configuration.leaves": { _id: leaveId },
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default WorkerRepository;
