interface Admin {
  _id?:string;
  name: string;
  email: string;
  password: string;
  role?: "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export default Admin;
