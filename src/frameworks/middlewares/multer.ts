import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a type for the files in the request
interface MulterRequest extends Request {
  files: {
    profilePic?: Express.Multer.File[];
    identityProof?: Express.Multer.File[];
    image?: Express.Multer.File[];
  };
}

export { upload, MulterRequest };
