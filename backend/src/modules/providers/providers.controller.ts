import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ProvidersService } from './providers.service';
import { OnboardProviderDto } from './dto/onboard-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProvidersDto } from './dto/query-providers.dto';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

  @Get()
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List service providers (admin, paginated, verification filter)' })
  list(@Query() query: QueryProvidersDto) {
    return this.providers.list(query);
  }

  @Post('onboard')
  @ApiBearerAuth()
  @Roles('CUSTOMER')
  @Audit({ action: 'ONBOARD', entity: 'ServiceProviderProfile' })
  @ApiOperation({ summary: 'Upgrade the current customer to a service provider' })
  onboard(@CurrentUser() user: AuthUser, @Body() dto: OnboardProviderDto) {
    return this.providers.onboard(user.id, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER')
  @ApiOperation({ summary: 'Get the current provider’s own profile' })
  getMine(@CurrentUser() user: AuthUser) {
    return this.providers.getMine(user.id);
  }

  @Patch('me')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER')
  @ApiOperation({ summary: 'Update the current provider’s own profile' })
  updateMine(@CurrentUser() user: AuthUser, @Body() dto: UpdateProviderDto) {
    return this.providers.updateMine(user.id, dto);
  }

  @Get(':id/services')
  @Public()
  @ApiOperation({ summary: 'List a provider’s active services (public)' })
  publicServices(@Param('id') id: string, @Query() query: QueryProvidersDto) {
    return this.providers.publicServices(id, query);
  }

  @Patch(':id/verify')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'VERIFY', entity: 'ServiceProviderProfile' })
  @ApiOperation({ summary: 'Verify a service provider (admin)' })
  verify(@Param('id') id: string) {
    return this.providers.verify(id);
  }
}
