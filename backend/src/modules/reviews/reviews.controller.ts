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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

/** Reviews nested under a service: public read, customer create. */
@ApiTags('reviews')
@Controller('services/:id/reviews')
export class ServiceReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published reviews for a service (public)' })
  list(@Param('id') serviceId: string, @Query() query: PaginationQueryDto) {
    return this.reviews.listForService(serviceId, query);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create a review (requires a completed booking)' })
  create(
    @CurrentUser() user: AuthUser,
    @Param('id') serviceId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviews.create(user, serviceId, dto);
  }
}

/** Review management by id: edit (own, within window), delete (own/admin). */
@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Patch(':id')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Edit your own review within the edit window' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviews.update(user, id, dto);
  }

  @Delete(':id')
  @Roles('CUSTOMER', 'ADMIN')
  @Audit({ action: 'DELETE', entity: 'Review' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete your own review (or any review as admin)' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.reviews.remove(user, id);
    return { message: 'Review deleted' };
  }
}
