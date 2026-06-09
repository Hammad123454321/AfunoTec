import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * SMTP mailer with a console fallback. When `SMTP_HOST` is empty (dev/CI before
 * the client provides credentials) emails are logged instead of sent, so OTP
 * and notification flows work end-to-end without a real provider.
 */
@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private from = 'no-reply@example.com';

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const host = this.config.get<string>('mail.host');
    this.from = this.config.get<string>('mail.from') ?? this.from;
    if (host) {
      this.transporter = createTransport({
        host,
        port: this.config.get<number>('mail.port') ?? 587,
        secure: this.config.get<boolean>('mail.secure') ?? false,
        auth: {
          user: this.config.get<string>('mail.user') ?? '',
          pass: this.config.get<string>('mail.password') ?? '',
        },
      });
      this.logger.log(`Mail transport configured (host: ${host})`);
    } else {
      this.logger.warn('SMTP_HOST not set — emails will be logged to the console');
    }
  }

  async send(input: SendMailInput): Promise<void> {
    if (!this.transporter) {
      this.logger.log(
        `[mail:console] to=${input.to} subject="${input.subject}"\n${input.text}`,
      );
      return;
    }
    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }

  async sendOtp(to: string, code: string, purpose: string): Promise<void> {
    await this.send({
      to,
      subject: 'Your verification code',
      text: `Your ${purpose} code is ${code}. It expires shortly. If you didn't request this, ignore this email.`,
    });
  }

  async sendPasswordReset(to: string, code: string): Promise<void> {
    await this.send({
      to,
      subject: 'Reset your password',
      text: `Use code ${code} to reset your password. It expires shortly.`,
    });
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await this.send({
      to,
      subject: 'Welcome',
      text: `Hi ${name}, welcome aboard!`,
    });
  }
}
