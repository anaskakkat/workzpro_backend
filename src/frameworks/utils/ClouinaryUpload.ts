import cloudinary from "../config/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

async function uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer); // Use the file buffer
  });
}

export default uploadToCloudinary;