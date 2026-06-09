import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { OwnsResource } from '../../common/decorators/owns-resource.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AttachImagesDto } from './dto/attach-images.dto';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  // -- Public listing & detail (literal/me routes declared before :slug) ------

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active services with filters (public)' })
  list(@Query() query: QueryServicesDto) {
    return this.services.list(query);
  }

  @Get('me/list')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @ApiOperation({ summary: 'List the current provider’s own services' })
  listMine(@CurrentUser() user: AuthUser, @Query() query: QueryServicesDto) {
    return this.services.listMine(user, query);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @Audit({ action: 'CREATE', entity: 'Service' })
  @ApiOperation({ summary: 'Create a service (DRAFT)' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateServiceDto) {
    return this.services.create(user, dto);
  }

  @Post(':id/track-view')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track a service view (debounced per IP)' })
  async trackView(@Param('id') id: string, @Req() req: Request) {
    await this.services.trackView(id, req.ip ?? null);
    return { tracked: true };
  }

  @Post(':id/images')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'IMAGE_ATTACH', entity: 'Service' })
  @ApiOperation({ summary: 'Attach images to a service' })
  addImages(@Param('id') id: string, @Body() dto: AttachImagesDto) {
    return this.services.addImages(id, dto.images);
  }

  @Delete(':id/images/:imageId')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'IMAGE_DETACH', entity: 'Service' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an image from a service' })
  async removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    await this.services.removeImage(id, imageId);
    return { message: 'Image removed' };
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'STATUS_CHANGE', entity: 'Service' })
  @ApiOperation({ summary: 'Change a service’s status' })
  setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.services.setStatus(id, dto.status);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'UPDATE', entity: 'Service' })
  @ApiOperation({ summary: 'Update a service' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'DELETE', entity: 'Service' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a service' })
  async remove(@Param('id') id: string) {
    await this.services.remove(id);
    return { message: 'Service deleted' };
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get full service detail by slug (public)' })
  getBySlug(@Param('slug') slug: string) {
    return this.services.getBySlug(slug);
  }
}
