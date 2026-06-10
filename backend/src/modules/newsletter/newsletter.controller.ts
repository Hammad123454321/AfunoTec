import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { QuerySubscribersDto } from './dto/query-subscribers.dto';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletter: NewsletterService) {}

  @Post('subscribe')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe to the newsletter (public)' })
  subscribe(@Body() dto: SubscribeDto) {
    return this.newsletter.subscribe(dto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List newsletter subscribers (admin)' })
  list(@Query() query: QuerySubscribersDto) {
    return this.newsletter.list(query);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'DELETE', entity: 'NewsletterSubscriber' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a subscriber (admin)' })
  async remove(@Param('id') id: string) {
    await this.newsletter.remove(id);
    return { message: 'Subscriber removed' };
  }
}
