import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

// In-memory store for M2; replaced by a DB-backed table in Milestone 3.
let integrationConfig: Record<string, string | null> = {
  googleAnalyticsId: null,
  facebookPixelId: null,
  hotjarId: null,
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly config: ConfigService) {
    integrationConfig = {
      googleAnalyticsId: config.get<string>('GOOGLE_ANALYTICS_ID') ?? null,
      facebookPixelId: config.get<string>('FACEBOOK_PIXEL_ID') ?? null,
      hotjarId: config.get<string>('HOTJAR_ID') ?? null,
    };
  }

  /**
   * Accept-and-ack batch event ingestion. Events are not persisted in M2;
   * full GA/FB bridge wired in Milestone 3.
   */
  async ingestEvents(events: AnalyticsEvent[]) {
    return { accepted: events.length, queued: false };
  }

  async getIntegrationConfig() {
    return { ...integrationConfig };
  }

  async updateIntegrationConfig(dto: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    hotjarId?: string;
  }) {
    if (dto.googleAnalyticsId !== undefined) integrationConfig.googleAnalyticsId = dto.googleAnalyticsId;
    if (dto.facebookPixelId !== undefined) integrationConfig.facebookPixelId = dto.facebookPixelId;
    if (dto.hotjarId !== undefined) integrationConfig.hotjarId = dto.hotjarId;
    return { ...integrationConfig };
  }
}
