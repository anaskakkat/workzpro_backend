import Admin from "../entities/admin";
import AdminModel from "../frameworks/models/adminModel";
import UserModel from "../frameworks/models/userModel";

import IAdminRepo from "../use-cases/interfaces/admin/IAdminRepo";

class AdminRepository implements IAdminRepo {
  async FindAdminByEmail(email: string) {
    return AdminModel.findOne({ email }).exec();
  }
  async getAllUsersdata() {
    return UserModel.find();
  }
  async FindUserById(id:any){
    return UserModel.findById(id)
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
}

export default AdminRepository;
