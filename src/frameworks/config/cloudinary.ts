import { v2 as cloudinary } from "cloudinary";
import { CLODINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../constants/env";

cloudinary.config({
  cloud_name: CLODINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
