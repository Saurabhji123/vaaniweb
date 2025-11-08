/* eslint-disable no-console */
const path = require('node:path');
const dotenv = require('dotenv');
const { v2: cloudinary } = require('cloudinary');

// Load secrets from .env.local (ignored by git)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing Cloudinary env vars: ${missing.join(', ')}`);
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'vaaniweb';
  const publicId = `connectivity-check-${Date.now()}`;

  console.log(`Uploading sample asset to folder "${folder}" as ${publicId}...`);

  const uploadResult = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
    {
      folder,
      public_id: publicId,
      overwrite: true,
    }
  );

  console.log('Upload successful:', {
    secureUrl: uploadResult.secure_url,
    format: uploadResult.format,
    bytes: uploadResult.bytes,
    width: uploadResult.width,
    height: uploadResult.height,
    publicId: uploadResult.public_id,
  });

  const optimizedUrl = cloudinary.url(uploadResult.public_id, {
    secure: true,
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log('Optimized delivery URL:', optimizedUrl);

  const autoCropUrl = cloudinary.url(uploadResult.public_id, {
    secure: true,
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log('Auto-cropped preview URL:', autoCropUrl);
}

main()
  .then(() => {
    console.log('Cloudinary smoke test completed.');
  })
  .catch((error) => {
    console.error('Cloudinary smoke test failed:', error);
    process.exit(1);
  });
