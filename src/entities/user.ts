interface User {
  _id?: string;
  userName: string;
  email: string;
  phoneNumber?: number;
  password: string;
  wallet?: number;
  role?:string;
  profilePicture?: string;
  isBlocked?: boolean;
  createdAt?: Date; 
  updatedAt?: Date; 
  status?:string
}

export default User;
