import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all tags' })
  list(
    @Query('locale') localeQuery?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    return this.tags.list(localeQuery ?? acceptLanguage);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a single tag by slug' })
  getBySlug(
    @Param('slug') slug: string,
    @Query('locale') localeQuery?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    return this.tags.getBySlug(slug, localeQuery ?? acceptLanguage);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'CREATE', entity: 'Tag' })
  @ApiOperation({ summary: 'Create a tag (admin)' })
  create(@Body() dto: CreateTagDto) {
    return this.tags.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'UPDATE', entity: 'Tag' })
  @ApiOperation({ summary: 'Update a tag (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tags.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'DELETE', entity: 'Tag' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a tag (cascades service-tag links)' })
  async remove(@Param('id') id: string) {
    await this.tags.remove(id);
    return { message: 'Tag deleted' };
  }
}
