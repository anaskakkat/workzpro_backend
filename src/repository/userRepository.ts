import User from "../entities/user";
import Otp from "../entities/otp";
import OtpModel from "../frameworks/models/otpModel";
import NonUserModel from "../frameworks/models/nonVerifyUser";
import UserModel from "../frameworks/models/userModel";
import IUserRepo from "../use-cases/interfaces/users/IuserRepo";
import serviceModel from "../frameworks/models/serviceModel";
import WorkerModel from "../frameworks/models/workerModel";
import { error } from "console";
import ReviewModel from "../frameworks/models/reviewModel";

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
    try {
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
    } catch (error) {}
    console.log(error);
    throw error;
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

  // async fetchWorkers(
  //   serviceId: string,
  //   location: { type: string; coordinates: [number, number] }
  // ) {
  //   const radiusInKm = 20;
  //   const radiusInMeters = radiusInKm * 1000;
  //   // console.log("location-------", location);
  //   // console.log("serviceId-------", serviceId);

  //   return await WorkerModel.find({
  //     service: serviceId,
  //     location: {
  //       $near: {
  //         $geometry: {
  //           type: "Point",
  //           coordinates: location.coordinates,
  //         },
  //         $maxDistance: radiusInMeters,
  //       },
  //     },
  //   }).populate("service");
  // }
  async fetchWorkers(
    serviceId: string,
    location: { type: string; coordinates: [number, number] }
  ) {
    const radiusInKm = 20;
    const radiusInMeters = radiusInKm * 1000;

    // Find workers near the location
    const workers = await WorkerModel.find({
      service: serviceId,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates,
          },
          $maxDistance: radiusInMeters,
        },
      },
    }).populate("service");

    // Fetch ratings for each worker
    const workersWithRatings = await Promise.all(
      workers.map(async (worker) => {
        // Fetch reviews for the current worker
        const reviews = await ReviewModel.find({ workerId: worker._id });
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = reviews.length ? totalRating / reviews.length : 0;

        return {
          ...worker.toObject(),
          averageRating,
        };
      })
    );

    return workersWithRatings;
  }

  async fetchWorkerByID(id: string) {
    return await WorkerModel.findById(id).populate("service");
  }
}

export default UserRepository;
