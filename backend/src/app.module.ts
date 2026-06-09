import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';

import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { redisConfig } from './config/redis.config';
import { storageConfig } from './config/storage.config';
import { mailConfig } from './config/mail.config';
import { paymentsConfig } from './config/payments.config';
import { fxConfig } from './config/fx.config';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthCoreModule } from './common/auth-core/auth-core.module';
import { AppCacheModule } from './common/cache/app-cache.module';
import { IdempotencyModule } from './common/idempotency/idempotency.module';
import { MailModule } from './common/mail/mail.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { OwnershipGuard } from './common/guards/ownership.guard';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { ServicesModule } from './modules/services/services.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { CartModule } from './modules/cart/cart.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ChatModule } from './modules/chat/chat.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AdsModule } from './modules/ads/ads.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { AuditModule } from './modules/audit/audit.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        redisConfig,
        storageConfig,
        mailConfig,
        paymentsConfig,
        fxConfig,
      ],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : { target: 'pino-pretty', options: { colorize: true, singleLine: true } },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
          remove: true,
        },
      },
    }),

    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL ?? 60) * 1000,
        limit: Number(process.env.RATE_LIMIT_LIMIT ?? 100),
      },
    ]),

    ScheduleModule.forRoot(),

    // Cross-cutting
    PrismaModule,
    AuthCoreModule,
    AppCacheModule,
    IdempotencyModule,
    MailModule,

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    ProvidersModule,
    CategoriesModule,
    TagsModule,
    ServicesModule,
    AvailabilityModule,
    CartModule,
    BookingsModule,
    PaymentsModule,
    PromotionsModule,
    ReviewsModule,
    ChatModule,
    UploadsModule,
    AdsModule,
    AdminModule,
    AnalyticsModule,
    I18nModule,
    AuditModule,
    AiModule,
  ],
  providers: [
    // Guard order matters: rate-limit → authenticate → role → ownership.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OwnershipGuard,
    },
  ],
})
export class AppModule {}
