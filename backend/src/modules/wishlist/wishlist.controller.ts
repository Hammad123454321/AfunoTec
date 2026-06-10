import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@ApiTags('wishlist')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user’s wishlist' })
  list(@CurrentUser() user: AuthUser) {
    return this.wishlist.list(user.id);
  }

  @Post(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a service to the wishlist (idempotent)' })
  add(@CurrentUser() user: AuthUser, @Param('serviceId') serviceId: string) {
    return this.wishlist.add(user.id, serviceId);
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a service from the wishlist (idempotent)' })
  remove(@CurrentUser() user: AuthUser, @Param('serviceId') serviceId: string) {
    return this.wishlist.remove(user.id, serviceId);
  }
}
