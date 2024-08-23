import { ObjectId } from "mongoose";

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
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  // location?: {};
  locationName?: string;
  workRadius?: number;
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
  commonProblems?:ObjectId[]
}

export default Worker;
