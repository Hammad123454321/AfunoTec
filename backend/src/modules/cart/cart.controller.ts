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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current cart' })
  getCart(@CurrentUser() user: AuthUser) {
    return this.cart.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  addItem(@CurrentUser() user: AuthUser, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(user.id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update a cart item' })
  updateItem(
    @CurrentUser() user: AuthUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.updateItem(user.id, itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove a cart item' })
  removeItem(@CurrentUser() user: AuthUser, @Param('itemId') itemId: string) {
    return this.cart.removeItem(user.id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear the cart' })
  clear(@CurrentUser() user: AuthUser) {
    return this.cart.clear(user.id);
  }
}
