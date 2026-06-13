import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { PromotionsService } from './promotions.service';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller()
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // ─── Promo codes ──────────────────────────────────────────────────────────

  @Get('promo-codes')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List promo codes' })
  listPromoCodes(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.promotionsService.listPromoCodes(page, limit);
  }

  @Post('promo-codes')
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @Audit({ action: 'CREATE', entity: 'PromoCode' })
  @ApiOperation({ summary: 'Create a promo code' })
  createPromoCode(@Body() dto: any) {
    return this.promotionsService.createPromoCode(dto);
  }

  @Patch('promo-codes/:id')
  @Roles('ADMIN')
  @Audit({ action: 'UPDATE', entity: 'PromoCode' })
  @ApiOperation({ summary: 'Update a promo code' })
  updatePromoCode(@Param('id') id: string, @Body() dto: any) {
    return this.promotionsService.updatePromoCode(id, dto);
  }

  @Delete('promo-codes/:id')
  @Roles('ADMIN')
  @Audit({ action: 'DEACTIVATE', entity: 'PromoCode' })
  @ApiOperation({ summary: 'Deactivate a promo code' })
  deactivatePromoCode(@Param('id') id: string) {
    return this.promotionsService.deactivatePromoCode(id);
  }

  @Post('promo-codes/validate')
  @HttpCode(HttpStatus.OK)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Validate a promo code and preview discount' })
  validatePromoCode(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.promotionsService.validatePromoCode(userId, dto);
  }

  // ─── Gift cards ───────────────────────────────────────────────────────────

  @Post('gift-cards/purchase')
  @HttpCode(HttpStatus.CREATED)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Purchase a gift card (Milestone 4)' })
  purchaseGiftCard(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.promotionsService.purchaseGiftCard(userId, dto);
  }

  @Post('gift-cards/validate')
  @HttpCode(HttpStatus.OK)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Validate a gift card and get remaining balance' })
  validateGiftCard(@Body('code') code: string) {
    return this.promotionsService.validateGiftCard(code);
  }

  @Get('gift-cards/me')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'My gift cards' })
  myGiftCards(@CurrentUser('id') userId: string) {
    return this.promotionsService.myGiftCards(userId);
  }

  @Get('gift-cards')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List all gift cards (ADMIN)' })
  listGiftCards(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.promotionsService.listGiftCards(page, limit);
  }

  @Patch('gift-cards/:id/deactivate')
  @Roles('ADMIN')
  @Audit({ action: 'DEACTIVATE', entity: 'GiftCard' })
  @ApiOperation({ summary: 'Deactivate a gift card' })
  deactivateGiftCard(@Param('id') id: string) {
    return this.promotionsService.deactivateGiftCard(id);
  }
}
