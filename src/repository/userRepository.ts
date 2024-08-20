import User from "../entities/user";
import Otp from "../entities/otp";
import OtpModel from "../frameworks/models/otpModel";
import NonUserModel from "../frameworks/models/nonVerifyUser";
import UserModel from "../frameworks/models/userModel";
import IUserRepo from "../use-cases/interfaces/users/IuserRepo";
import serviceModel from "../frameworks/models/serviceModel";
import WorkerModel from "../frameworks/models/workerModel";
import mongoose, { ObjectId } from "mongoose";
import SlotModel from "../frameworks/models/slotsModel";
import IBooking from "../entities/booking";
import BookingModel from "../frameworks/models/bookingsModel";

class UserRepository implements IUserRepo {
  async findUserByEmail(email: string) {
    return UserModel.findOne({ email: email }).exec();
  }
  async findUserById(id: string) {
    return UserModel.findById(id).exec();
  }

  async findPhoneNumber(phoneNumber: number) {
    return UserModel.findOne({ phoneNumber: phoneNumber }).exec();
  }

  async saveUserDataTemp(user: User) {
    try {
      const filter = { email: user.email };
      const update = {
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      };
      const options = {
        upsert: true,
        new: true,
      };
      return await NonUserModel.findOneAndUpdate(
        filter,
        update,
        options
      ).exec();
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }
  async createUser(userData: {
    name: string;
    email: string;
    user: string;
    picture: string;
    hashedPassword: string;
  }) {
    const user = new UserModel({
      email: userData.email,
      userName: userData.name,
      picture: userData.picture,
      password: userData.hashedPassword,
      status: "verified",
    });
    const data = await user.save();
    // console.log("--data--", data);

    return data;
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
  async findOtpByEmail(email: string) {
    return OtpModel.findOne({ email: email });
  }
  async deleteOtpByEmail(email: string) {
    return OtpModel.deleteMany({ email: email });
  }
  async findNonVerifiedUserByEmail(email: string) {
    return NonUserModel.findOne({ email: email });
  }
  async saveVerifiedUser(userData: any) {
    const verifiedUser = new UserModel(userData);
    return verifiedUser.save();
  }
  async deleteNonVerifiedUserByEmail(email: string) {
    return NonUserModel.deleteOne({ email: email });
  }
  async getServices() {
    return serviceModel.find();
  }
  async fetchWorkers() {
    return WorkerModel.find({}).populate("service");
  }
  async fetchWorkerByID(id: string) {
    return WorkerModel.findById(id).populate("service");
  }
  async fetchSlotById(id: string) {
    // console.log('id:',id)
    return await SlotModel.find({ workerId: id });
  }
  async fetchSlotID(id: ObjectId) {
    // console.log('id:',id)
    return await SlotModel.findById(id);
  }
  async findSlotById(id: string) {
    console.log("id:", id);

    return await SlotModel.aggregate([
      { $unwind: "$slots" },
      { $match: { "slots._id": new mongoose.Types.ObjectId(id) } },
      { $project: { _id: 0, workerId: 0 } },
    ]);
  }
  async saveBooking(userId: string, data: IBooking) {
    // console.log('booking-repo',data);

    const newBooking = new BookingModel({
      userId: userId,
      workerId: data.workerId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      selectedSlot: data.selectedSlot,
      location: data.location,
      date: data.date,
    });
    const savedBooking = await newBooking.save();

    return savedBooking;
  }

  async updateSlot(slotId: ObjectId) {
    return SlotModel.findByIdAndUpdate(
      slotId,
      { isBooked: true },
      { new: true }
    ).exec();
  }
  async findBookingById(id: string) {
    return BookingModel.findById(id)
      .populate("userId")
      .populate("workerId")
      .populate("selectedSlot");
  }
}

export default UserRepository;
