import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'faunapulse',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'faunapulse_animals',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `animal_${Date.now()}`
    };
  }
});

export const uploadCloudinary = multer({ storage: storage });
export { cloudinary };
