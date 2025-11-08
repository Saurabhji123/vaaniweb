import { Buffer } from 'node:buffer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) {
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  configured = true;
}

export interface UploadImageParams {
  buffer: Buffer;
  filename?: string;
  mimeType?: string;
  folder?: string;
}

export interface UploadImageResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImageToCloudinary(params: UploadImageParams): Promise<UploadImageResult> {
  ensureConfigured();

  const { buffer, filename, mimeType, folder } = params;
  const fileMime = mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg';
  const uploadFolder = folder || process.env.CLOUDINARY_UPLOAD_FOLDER || 'vaaniweb';

  const base64 = buffer.toString('base64');
  const dataUri = `data:${fileMime};base64,${base64}`;

  const publicId = filename
    ? filename
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .toLowerCase()
    : undefined;

  const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder: uploadFolder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: false,
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}
