interface Worker {
    _id?: string;
    workerId?: number;
    name: string;
    email: string;
    phoneNumber: number;
    password: string;
    service?: any; 
    experience?: number;
    location?: string;
    identityProof?: string;
    wallet?: number;
    profilePicture?: string;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    status?: string;
    images?: string[];
  }
  
  export default Worker;
  