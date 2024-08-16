interface Worker {
  _id?: string;
  workerId?: string;
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  service?: string;
  slots?: string;
  experience?: number;
  location?: string;
  role?: "worker";
  identityProof?: string;
  wallet?: number;
  wageDay?: number;
  profilePicture?: string;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  images?: string[];
  isProfileSetup?: boolean;
  loginAccess?: boolean;
}

export default Worker;
