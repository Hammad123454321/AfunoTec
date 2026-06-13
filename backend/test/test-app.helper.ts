import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.test WITHOUT overriding vars already set by global-setup
// (MONGODB_URI / MONGODB_DB_NAME point at the in-memory replica set).
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

import { INestApplication, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { GlobalHttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { MongoExceptionFilter } from '../src/common/filters/mongo-exception.filter';
import { TransformResponseInterceptor } from '../src/common/interceptors/transform-response.interceptor';

let app: INestApplication;

export async function buildApp(): Promise<INestApplication> {
  if (app) return app;

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter(), new MongoExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformResponseInterceptor(),
  );

  await app.init();
  return app;
}

/** The app's live Mongoose connection (for direct DB access in tests). */
export function getConnection(): Connection {
  return app.get<Connection>(getConnectionToken());
}

export async function closeApp(): Promise<void> {
  if (app) {
    await app.close();
    app = undefined as unknown as INestApplication;
  }
}

/** Clears the given collections between suites (Mongo equivalent of TRUNCATE). */
export async function clearCollections(connection: Connection, names: string[]): Promise<void> {
  for (const name of names) {
    const coll = connection.collections[name];
    if (coll) await coll.deleteMany({});
  }
}
