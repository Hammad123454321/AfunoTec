import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  EMAILS_QUEUE,
  EmailJob,
  OtpJobData,
  PasswordResetJobData,
  WelcomeJobData,
} from './queue.constants';

/**
 * Producer for the `emails` queue. Auth and other modules enqueue email jobs
 * here instead of sending inline, so request latency is decoupled from SMTP.
 */
@Injectable()
export class MailQueue {
  constructor(@InjectQueue(EMAILS_QUEUE) private readonly queue: Queue) {}

  async enqueueOtp(data: OtpJobData): Promise<void> {
    await this.queue.add(EmailJob.Otp, data, this.defaultJobOpts());
  }

  async enqueuePasswordReset(data: PasswordResetJobData): Promise<void> {
    await this.queue.add(EmailJob.PasswordReset, data, this.defaultJobOpts());
  }

  async enqueueWelcome(data: WelcomeJobData): Promise<void> {
    await this.queue.add(EmailJob.Welcome, data, this.defaultJobOpts());
  }

  private defaultJobOpts() {
    return {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    };
  }
}
