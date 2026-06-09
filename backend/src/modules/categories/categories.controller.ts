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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List categories (active only unless includeInactive)' })
  list(
    @Query() query: QueryCategoriesDto,
    @Query('locale') localeQuery?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    return this.categories.list(query, localeQuery ?? acceptLanguage);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a single category by slug' })
  getBySlug(
    @Param('slug') slug: string,
    @Query('locale') localeQuery?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    return this.categories.getBySlug(slug, localeQuery ?? acceptLanguage);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'CREATE', entity: 'Category' })
  @ApiOperation({ summary: 'Create a category (admin)' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'UPDATE', entity: 'Category' })
  @ApiOperation({ summary: 'Update a category (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categories.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'DELETE', entity: 'Category' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a category (refused if it has active services)' })
  async remove(@Param('id') id: string) {
    await this.categories.remove(id);
    return { message: 'Category deleted' };
  }
}
