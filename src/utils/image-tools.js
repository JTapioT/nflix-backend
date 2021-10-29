import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nflix",
  },
});