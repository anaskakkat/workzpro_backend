import { CostumeError } from "../frameworks/middlewares/customError";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import JWTService from "../frameworks/utils/generateToken";
import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private _adminRepository: AdminRepository;
  private _encryptPassword: EncryptPassword;
  private _genrateToken: JWTService;

  constructor(
    adminrepository: AdminRepository,
    encryptPassword: EncryptPassword,
    generateToken: JWTService
  ) {
    this._adminRepository = adminrepository;
    this._encryptPassword = encryptPassword;
    this._genrateToken = generateToken;
  }

  async verifylogin(email: string, password: string) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          status: 400,
          message: "Invalid email format",
        };
      }

      if (password.length < 8) {
        return {
          status: 400,
          message: "Password must be at least 8 characters long",
        };
      }
      console.log(email, password);

      const admin = await this._adminRepository.FindAdminByEmail(email);
      console.log(admin);
      if (!admin) {
        return {
          status: 400,
          message: "Admin not found",
        };
      }
      const isPasswordCorrect = await this._encryptPassword.compare(
        password,
        admin.password
      );
      if (!isPasswordCorrect) {
        return {
          status: 400,
          message: "Password is incorrect",
        };
      }
      const tokens = this._genrateToken.generateToken(admin._id);
      //   console.log('tokens:tokens',tokens);
      return {
        status: 200,
        admin: {
          email: admin.email,
          name: admin.name,
        },
        message: "admin Login Successfully",
        tokens,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signup(name: string, email: string, password: string) {
    try {
      const hashedPassword = await this._encryptPassword.encrypt(password);
      const admin = {
        name,
        email,
        password: hashedPassword,
      };
      //   console.log('touched',admin);

      const data = await this._adminRepository.saveAdmin(admin);
      7;
      return {
        status: 200,
        message: "admin registered successfully",
      };
    } catch (error) {
      return { status: 400, message: "An error occurred" };
    }
  }
  async userData() {
    try {
      const userdata = await this._adminRepository.getAllUsersdata();
      console.log(userdata);

      return {
        status: 200,
        userdata,
        message: "Data fetched successfully",
      };
    } catch (error) {
      return { status: 400, message: "An error occurred" };
    }
  }
  async blockuser(id: any) {
    try {
      const userdata = await this._adminRepository.FindUserById(id);
      if (userdata) {
        userdata.isBlocked = true;

        await userdata.save();

        return {
          status: 200,
          userdata,
          message: "User blocked successfully",
        };
      } else {
        return {
          status: 404,
          message: "User not found",
        };
      }
    } catch (error) {
      return { status: 400, message: "An error occurred" };
    }
  }
  async unblockUser(id: any) {
    try {
      const userdata = await this._adminRepository.FindUserById(id);
      if (userdata) {
        userdata.isBlocked = false;

        await userdata.save();
        // console.log("userdata", userdata);

        return {
          status: 200,
          userdata,
          message: "User  unblock successfully",
        };
      } else {
        return {
          status: 404,
          message: "User not found",
        };
      }
    } catch (error) {
      return { status: 400, message: "An error occurred" };
    }
  }
  async createServices(name: string, description: string) {
    try {
      const exist = await this._adminRepository.existServices(name);
      console.log("exist-", exist);
      if (exist?.name === name) {
        throw new CostumeError(400, "Duplicate found");
      }
      const serviceData = await this._adminRepository.saveServices(
        name,
        description
      );
      if (serviceData) {
        return {
          status: 200,
          message: "Service saved successfully",
          data: serviceData,
        };
      } else {
        return {
          status: 404,
          message: "Service not found or created",
        };
      }
    } catch (error) {
      throw error;
      return { status: 400, message: "An error occurred" };
    }
  }
}

export default AdminUsecase;
