import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @Public()
  async liveness(): Promise<{ status: string; uptime: number }> {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('ready')
  @Public()
  async readiness(): Promise<{ status: string; db: boolean }> {
    let db = false;
    try {
      await this.connection.db?.admin().ping();
      db = this.connection.readyState === 1;
    } catch {
      db = false;
    }
    return { status: db ? 'ready' : 'degraded', db };
  }
}
