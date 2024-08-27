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
  commonProblems?: ObjectId[];
  configuration?: Configuration;
}

export default Worker;

export interface WorkingDay {
  start: string;
  end: string;
  isWorking: boolean;
}
export interface Services {
  service: any;
  description: string;
  amount: number;
  slots: number;
}
export interface Configuration {
  workingDays: WorkingDay[];
  slotSize: number;
  bufferTime: number;
  services: Services[];
  leaves: { date: string | Date; reason: string }[];
}
export interface Leave {
  date: string | Date;
  reason: string;
}
