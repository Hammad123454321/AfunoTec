import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../../database/schemas/promo-code.schema';
import { GiftCard, GiftCardDocument } from '../../database/schemas/gift-card.schema';
import { PromoCodeType } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { Decimal, toDecimal, toDecimal128 } from '../../common/utils/money.util';
import { clampPagination, buildPaginationMeta } from '../../common/utils/pagination';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';

type PromoCodeRecord = Record<string, unknown> & { id: string };
type GiftCardRecord = Record<string, unknown> & { id: string };

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(GiftCard.name) private readonly giftCardModel: Model<GiftCardDocument>,
  ) {}

  // ─── Promo codes ──────────────────────────────────────────────────────────

  async listPromoCodes(page?: number, limit?: number) {
    const { skip, take, page: p, limit: l } = clampPagination(page, limit);
    const [data, total] = await Promise.all([
      this.promoCodeModel.find().sort({ createdAt: 'desc' }).skip(skip).limit(take).lean().exec(),
      this.promoCodeModel.countDocuments().exec(),
    ]);
    return {
      data: data.map((pc) => this.shapePromoCode(pc)),
      meta: buildPaginationMeta(total, p, l),
    };
  }

  async createPromoCode(dto: {
    code: string;
    type: 'PERCENT' | 'FIXED';
    value: number;
    startAt: string;
    endAt: string;
    description?: string;
    minSpend?: number;
    usageLimit?: number;
    perUserLimit?: number;
  }): Promise<PromoCodeRecord> {
    try {
      const created = await this.promoCodeModel.create({
        code: dto.code.toUpperCase(),
        type: dto.type as PromoCodeType,
        value: toDecimal128(dto.value),
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        description: dto.description,
        minSpend: dto.minSpend !== undefined ? toDecimal128(dto.minSpend) : undefined,
        usageLimit: dto.usageLimit,
        perUserLimit: dto.perUserLimit,
      });
      return this.shapePromoCode(created.toObject() as never);
    } catch (err: any) {
      if (err?.code === 11000) throw new BadRequestException('Promo code already exists');
      throw err;
    }
  }

  async updatePromoCode(
    id: string,
    dto: { isActive?: boolean; endAt?: string; description?: string },
  ): Promise<PromoCodeRecord> {
    const patch: Record<string, unknown> = {};
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.endAt) patch.endAt = new Date(dto.endAt);
    if (dto.description !== undefined) patch.description = dto.description;

    const updated = await this.promoCodeModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Promo code not found');
    return this.shapePromoCode(updated);
  }

  async deactivatePromoCode(id: string) {
    const updated = await this.promoCodeModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Promo code not found');
    return { deactivated: true };
  }

  async validatePromoCode(
    _userId: string,
    dto: { code: string; cartTotal?: number; serviceIds?: string[] },
  ) {
    const now = new Date();
    const promo = await this.promoCodeModel.findOne({ code: dto.code.toUpperCase() }).lean().exec();
    if (!promo || !promo.isActive || promo.startAt > now || promo.endAt < now) {
      throw new BusinessRuleException('PROMO_CODE_INVALID', 'This promo code is invalid or expired');
    }
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      throw new BusinessRuleException('PROMO_CODE_EXHAUSTED', 'This promo code has no remaining uses');
    }
    const cartTotal = dto.cartTotal ?? 0;
    if (promo.minSpend && new Decimal(cartTotal).lessThan(toDecimal(promo.minSpend))) {
      throw new BusinessRuleException(
        'PROMO_MIN_SPEND',
        `Minimum spend of ${toDecimal(promo.minSpend).toString()} required`,
      );
    }

    const discount =
      promo.type === PromoCodeType.PERCENT
        ? new Decimal(cartTotal).times(toDecimal(promo.value)).dividedBy(100).toDecimalPlaces(2)
        : toDecimal(promo.value);

    return {
      valid: true,
      code: promo.code,
      type: promo.type,
      discountAmount: discount.toString(),
      description: promo.description,
    };
  }

  // ─── Gift cards ───────────────────────────────────────────────────────────

  async purchaseGiftCard(_userId: string, _dto: unknown) {
    throw new NotImplementedException('Gift card purchase requires payment gateway (Milestone 4)');
  }

  async validateGiftCard(code: string) {
    const card = await this.giftCardModel.findOne({ code }).lean().exec();
    if (!card || !card.isActive) {
      throw new BusinessRuleException('GIFT_CARD_INVALID', 'This gift card is invalid or deactivated');
    }
    const expired = card.expiresAt && card.expiresAt < new Date();
    if (expired) {
      throw new BusinessRuleException('GIFT_CARD_EXPIRED', 'This gift card has expired');
    }
    return {
      valid: true,
      balance: toDecimal(card.balance).toString(),
      currency: card.currency,
    };
  }

  async myGiftCards(userId: string): Promise<GiftCardRecord[]> {
    const cards = await this.giftCardModel
      .find({ ownedById: userId, isActive: true })
      .sort({ createdAt: 'desc' })
      .lean()
      .exec();
    return cards.map((c) => this.shapeGiftCard(c));
  }

  async listGiftCards(page?: number, limit?: number) {
    const { skip, take, page: p, limit: l } = clampPagination(page, limit);
    const [data, total] = await Promise.all([
      this.giftCardModel.find().sort({ createdAt: 'desc' }).skip(skip).limit(take).lean().exec(),
      this.giftCardModel.countDocuments().exec(),
    ]);
    return {
      data: data.map((c) => this.shapeGiftCard(c)),
      meta: buildPaginationMeta(total, p, l),
    };
  }

  async deactivateGiftCard(id: string) {
    const updated = await this.giftCardModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Gift card not found');
    return { deactivated: true };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private shapePromoCode(doc: Record<string, unknown>): PromoCodeRecord {
    const rec = toRecord(doc as never) as PromoCodeRecord;
    return {
      ...rec,
      value: toDecimal(rec.value as never).toString(),
      minSpend: rec.minSpend != null ? toDecimal(rec.minSpend as never).toString() : null,
    };
  }

  private shapeGiftCard(doc: Record<string, unknown>): GiftCardRecord {
    const rec = toRecord(doc as never) as GiftCardRecord;
    return {
      ...rec,
      initialAmount: toDecimal(rec.initialAmount as never).toString(),
      balance: toDecimal(rec.balance as never).toString(),
    };
  }
}
