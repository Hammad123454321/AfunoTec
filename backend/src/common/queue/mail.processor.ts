import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import {
  EMAILS_QUEUE,
  EmailJob,
  OtpJobData,
  PasswordResetJobData,
  WelcomeJobData,
} from './queue.constants';

/** Consumes the `emails` queue and dispatches each job to the MailService. */
@Processor(EMAILS_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mail: MailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJob.Otp: {
        const data = job.data as OtpJobData;
        await this.mail.sendOtp(data.to, data.code, data.purpose);
        break;
      }
      case EmailJob.PasswordReset: {
        const data = job.data as PasswordResetJobData;
        await this.mail.sendPasswordReset(data.to, data.code);
        break;
      }
      case EmailJob.Welcome: {
        const data = job.data as WelcomeJobData;
        await this.mail.sendWelcome(data.to, data.name);
        break;
      }
      default:
        this.logger.warn(`Unknown email job: ${job.name}`);
    }
  }
}
