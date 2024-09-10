import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value == undefined) {
    throw new Error(`missing env variable ${key}`);
  }
  return value;
};

export const PORT = getEnv("PORT", "4000");
export const MONGO_URI = getEnv("DATABASE_URI");

export const AUTH_MAIL = getEnv("AUTH_MAIL");
export const AUTH_MAIL_PASSWORD = getEnv("AUTH_MAIL_PASSWORD");
export const SECRET_KEY = getEnv("SECRET_KEY");
export const NODE_ENV = getEnv("NODE_ENV");
export const REFRESH_KEY = getEnv("REFRESH_KEY");

export const CLODINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
