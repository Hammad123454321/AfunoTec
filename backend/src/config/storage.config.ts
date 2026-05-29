import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  endpoint: process.env.S3_ENDPOINT ?? '',
  region: process.env.S3_REGION ?? 'auto',
  bucket: process.env.S3_BUCKET ?? '',
  accessKey: process.env.S3_ACCESS_KEY ?? '',
  secretKey: process.env.S3_SECRET_KEY ?? '',
  publicUrl: process.env.S3_PUBLIC_URL ?? '',
}));
