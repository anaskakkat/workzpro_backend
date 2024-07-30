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
        message: "User Login Successfully",
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
}

export default AdminUsecase;
