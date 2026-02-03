'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          tags: ['nextjs-upload'],
          resource_type: 'auto', // Important for different formats
          folder: 'profile_pics'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (err) {
    throw new Error("Failed to process image buffer");
  }
}