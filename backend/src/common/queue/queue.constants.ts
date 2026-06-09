/** BullMQ queue names. Keep in sync with processors and producers. */
export const EMAILS_QUEUE = 'emails';

/** Job names within the emails queue. */
export enum EmailJob {
  Otp = 'otp',
  PasswordReset = 'password-reset',
  Welcome = 'welcome',
}

export interface OtpJobData {
  to: string;
  code: string;
  purpose: string;
}

export interface PasswordResetJobData {
  to: string;
  code: string;
}

export interface WelcomeJobData {
  to: string;
  name: string;
}
