import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailQueue } from '../queue/mail.queue';
import { MailProcessor } from '../queue/mail.processor';
import { EMAILS_QUEUE } from '../queue/queue.constants';

/**
 * Wires the BullMQ connection (Redis), the `emails` queue, its producer
 * (`MailQueue`), worker (`MailProcessor`), and the underlying `MailService`.
 * Global so any module can inject `MailQueue` to send transactional email.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host') ?? 'localhost',
          port: config.get<number>('redis.port') ?? 6379,
          password: config.get<string>('redis.password') || undefined,
        },
      }),
    }),
    BullModule.registerQueue({ name: EMAILS_QUEUE }),
  ],
  providers: [MailService, MailQueue, MailProcessor],
  exports: [MailService, MailQueue],
})
export class MailModule {}
