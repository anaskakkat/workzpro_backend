interface Service {
  name: string;
  description: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Service;
