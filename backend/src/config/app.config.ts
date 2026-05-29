import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'ameer-nasr-backend',
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.APP_HOST ?? '0.0.0.0',
  port: parseInt(process.env.APP_PORT ?? '4000', 10),
  globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api/v1',
  corsOrigins: (process.env.APP_CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  enableSwagger: (process.env.ENABLE_SWAGGER ?? 'true') === 'true',
  swaggerPath: process.env.SWAGGER_PATH ?? 'api/docs',
}));
