import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: false, // configured explicitly below
  });

  // Pino logger (replaces Nest default logger)
  app.useLogger(app.get(Logger));

  // Security headers, compression, cookies
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cookieParser());

  // CORS
  const corsOrigins = (process.env.APP_CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });

  // Global prefix + versioning
  const globalPrefix = process.env.APP_GLOBAL_PREFIX ?? 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({ type: VersioningType.URI });

  // Global pipes/filters/interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter(), new PrismaExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformResponseInterceptor(),
  );

  // Swagger / OpenAPI
  if ((process.env.ENABLE_SWAGGER ?? 'true') === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('ameer_nasr API')
      .setDescription('Madagascar intermediary booking platform — REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(process.env.SWAGGER_PATH ?? 'api/docs', app, document);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = Number(process.env.APP_PORT ?? 4000);
  const host = process.env.APP_HOST ?? '0.0.0.0';
  await app.listen(port, host);
}

void bootstrap();
