import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
  accessTtl: parseInt(process.env.JWT_ACCESS_TTL ?? '900', 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
  refreshTtl: parseInt(process.env.JWT_REFRESH_TTL ?? '604800', 10),
  otpTtlSeconds: parseInt(process.env.OTP_TTL_SECONDS ?? '300', 10),
  otpLength: parseInt(process.env.OTP_LENGTH ?? '6', 10),
  otpMaxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS ?? '5', 10),
}));
