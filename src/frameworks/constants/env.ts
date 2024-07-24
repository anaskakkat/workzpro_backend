import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value == undefined) {
    throw new Error(`missing env variable ${key}`);
  }
  return value;
};

export const PORT = getEnv("PORT", "8000");
export const MONGO_URI = getEnv("DATABASE_URI");

export const AUTH_MAIL = getEnv("AUTH_MAIL");
export const AUTH_MAIL_PASSWORD = getEnv("AUTH_MAIL_PASSWORD");
