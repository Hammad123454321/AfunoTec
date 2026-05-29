import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';

/**
 * AI / token system — OUT OF SCOPE for the current milestone.
 * This module reserves the route path and module registration so we can
 * implement it without touching the rest of the codebase once the client
 * provides the AI specs and credentials.
 */
@Module({
  controllers: [AiController],
})
export class AiModule {}
