import { CostumeError } from "../frameworks/middlewares/customError";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
import JWTService from "../frameworks/utils/generateToken";
import NodemailerEmailService from "../frameworks/utils/sentMail";
import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private _adminRepository: AdminRepository;
  private _encryptPassword: EncryptPassword;
  private _genrateToken: JWTService;
  private _nodeMailerService: NodemailerEmailService;
  constructor(
    adminrepository: AdminRepository,
    encryptPassword: EncryptPassword,
    generateToken: JWTService,
    nodeMiler: NodemailerEmailService
  ) {
    this._adminRepository = adminrepository;
    this._encryptPassword = encryptPassword;
    this._genrateToken = generateToken;
    this._nodeMailerService = nodeMiler;
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
      // console.log(email, password);

      const admin = await this._adminRepository.FindAdminByEmail(email);
      console.log("---admin----", admin);
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
      const tokens = this._genrateToken.generateToken(
        admin._id,
        admin.role as string
      );
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
      throw error;
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
      throw error;
    }
  }
  async userData() {
    try {
      const userdata = await this._adminRepository.getAllUsersdata();

      return {
        status: 200,
        userdata,
        message: "Data fetched successfully",
      };
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }
  async createServices(name: string, description: string) {
    try {
      const exist = await this._adminRepository.existServices(name);
      // console.log("exist-", exist);
      if (exist?.name === name) {
        throw new CostumeError(400, "Service with this name already exists");
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
    }
  }
  async getServices() {
    try {
      const serviceData = await this._adminRepository.getServices();
      // console.log("serviceData-", serviceData);

      if (serviceData) {
        return {
          status: 200,
          message: "Service data fethed successfully",
          data: serviceData,
        };
      } else {
        throw new CostumeError(400, "not get service data");
      }
    } catch (error) {
      throw error;
    }
  }
  async blockServices(id: any) {
    try {
      const data = await this._adminRepository.findServicesById(id);
      console.log(data);

      if (data) {
        data.isBlocked = true;

        await data.save();

        return {
          status: 200,
          message: "Services blocked successfully",
        };
      } else {
        throw new CostumeError(400, " no service found");
      }
    } catch (error) {
      throw error;
    }
  }
  async unblockServices(id: any) {
    try {
      const data = await this._adminRepository.findServicesById(id);
      // console.log(data);

      if (data) {
        data.isBlocked = false;

        await data.save();

        return {
          status: 200,
          message: "Services unblocked successfully",
        };
      } else {
        throw new CostumeError(400, " no service found");
      }
    } catch (error) {
      throw error;
    }
  }
  async editServices(id: any, name: string, desc: string) {
    try {
      const data = await this._adminRepository.findServicesById(id);

      if (data) {
        data.name = name;
        data.description = desc;
        await data.save();

        return {
          status: 200,
          message: "Services unblocked successfully",
        };
      } else {
        throw new CostumeError(400, " no service found");
      }
    } catch (error) {
      throw error;
    }
  }
  async getWorkers() {
    try {
      const serviceData = await this._adminRepository.getWorkers();
      // console.log("serviceData-", serviceData);

      if (serviceData) {
        return {
          status: 200,
          message: "Service data fethed successfully",
          data: serviceData,
        };
      } else {
        throw new CostumeError(400, "not get service data");
      }
    } catch (error) {
      throw error;
    }
  }
  async blockWorker(id: any) {
    try {
      const userdata = await this._adminRepository.FindWorkerById(id);
      if (userdata) {
        userdata.isBlocked = true;

        await userdata.save();

        return {
          status: 200,
          userdata,
          message: "Worker blocked successfully",
        };
      } else {
        throw new CostumeError(404, "Worker not found");
      }
    } catch (error) {
      throw error;
    }
  }
  async unblockWorker(id: any) {
    try {
      const userdata = await this._adminRepository.FindWorkerById(id);
      if (userdata) {
        userdata.isBlocked = false;

        await userdata.save();

        return {
          status: 200,
          userdata,
          message: "Worker unblocked successfully",
        };
      } else {
        throw new CostumeError(404, "Worker not found");
      }
    } catch (error) {
      throw error;
    }
  }
  async worker_request(id: any) {
    try {
      const userdata = await this._adminRepository.FindWorkerById(id);
      if (userdata) {
        userdata.isProfileSetup = true;
        userdata.loginAccess = true;

        await userdata.save();

        return {
          status: 200,
          userdata,
          message: "Worker request accepted ",
        };
      } else {
        throw new CostumeError(404, "Worker not found");
      }
    } catch (error) {
      throw error;
    }
  }
  async requestReject(id: string, reason: string) {
    try {
      const worker = await this._adminRepository.FindWorkerById(id);
      if (!worker) {
        throw new CostumeError(400, "Worker not found.");
      }
      await this._nodeMailerService.sendRejectionEmail(worker.email, reason);
      const delWorker = await this._adminRepository.deleteWorkerById(id);
      return {
        status: 200,
        message: "Request Rejected",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AdminUsecase;
