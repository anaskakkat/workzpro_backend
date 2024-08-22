import Admin from "../entities/admin";
import AdminModel from "../frameworks/models/adminModel";
import serviceModel from "../frameworks/models/serviceModel";
import UserModel from "../frameworks/models/userModel";
import WorkerModel from "../frameworks/models/workerModel";

import IAdminRepo from "../use-cases/interfaces/admin/IAdminRepo";

class AdminRepository implements IAdminRepo {
  async FindAdminByEmail(email: string) {
    return AdminModel.findOne({ email }).exec();
  }
  async FindAdminById(id: string) {
    return await AdminModel.findById(id).exec();
  }
  async getAllUsersdata() {
    return UserModel.find();
  }
  async FindUserById(id: any) {
    return UserModel.findById(id);
  }
  async FindWorkerById(id: any) {
    return WorkerModel.findById(id);
  }
  async saveAdmin(admin: Admin) {
    try {
      console.log("repo", admin);

      const filter = { email: admin.email };
      const update = {
        userName: admin.name,
        email: admin.email,
        password: admin.password,
      };
      const options = {
        upsert: true,
        new: true,
      };

      return await AdminModel.findOneAndUpdate(filter, update, options).exec();
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }
  async existServices(name: string) {
    try {
      return await serviceModel.findOne({ name: name });
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }
  async saveServices(name: string, description: string) {
    try {
      const filter = { name };
      const update = { description };
      const options = { new: true, upsert: true };

      return await serviceModel
        .findOneAndUpdate(filter, update, options)
        .exec();
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }
  async getServices() {
    return serviceModel.find();
  }
  async getWorkers() {
    return WorkerModel.find();
  }

  async findServicesById(id: any) {
    return serviceModel.findById(id);
  }
  async editServices(id: string, name: string, description: string) {
    try {
      const filter = { id };
      const update = { name, description };
      const options = { new: true, upsert: true };

      return await serviceModel
        .findOneAndUpdate(filter, update, options)
        .exec();
    } catch (error) {
      throw new Error("Failed to save or update non-verified user data.");
    }
  }
}

export default AdminRepository;
