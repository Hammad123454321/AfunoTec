import { registerAs } from '@nestjs/config';

export const paymentsConfig = registerAs('payments', () => ({
  mvola: {
    baseUrl: process.env.MVOLA_BASE_URL ?? '',
    consumerKey: process.env.MVOLA_CONSUMER_KEY ?? '',
    consumerSecret: process.env.MVOLA_CONSUMER_SECRET ?? '',
    partnerName: process.env.MVOLA_PARTNER_NAME ?? '',
    callbackUrl: process.env.MVOLA_CALLBACK_URL ?? '',
  },
  airtelMoney: {
    baseUrl: process.env.AIRTEL_MONEY_BASE_URL ?? '',
    clientId: process.env.AIRTEL_MONEY_CLIENT_ID ?? '',
    clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET ?? '',
    callbackUrl: process.env.AIRTEL_MONEY_CALLBACK_URL ?? '',
  },
  orangeMoney: {
    baseUrl: process.env.ORANGE_MONEY_BASE_URL ?? '',
    clientId: process.env.ORANGE_MONEY_CLIENT_ID ?? '',
    clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET ?? '',
    callbackUrl: process.env.ORANGE_MONEY_CALLBACK_URL ?? '',
  },
  card: {
    baseUrl: process.env.CARD_GATEWAY_BASE_URL ?? '',
    apiKey: process.env.CARD_GATEWAY_API_KEY ?? '',
    callbackUrl: process.env.CARD_GATEWAY_CALLBACK_URL ?? '',
  },
}));
