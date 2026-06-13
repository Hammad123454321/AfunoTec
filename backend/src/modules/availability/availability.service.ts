import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceAvailability,
  ServiceAvailabilityDocument,
} from '../../database/schemas/service-availability.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { TransactionService } from '../../database/transaction.service';
import { toDecimal128 } from '../../common/utils/money.util';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { OverrideDayDto, SetAvailabilityDto } from './dto/availability.dto';

const MAX_RANGE_DAYS = 366;

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  qtyTotal: number;
  qtyReserved: number;
  qtyAvailable: number;
  price: string; // effective per-day price (override or base)
  isClosed: boolean;
  synthesized: boolean; // true when no explicit row exists for the day
}

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(ServiceAvailability.name)
    private readonly availabilityModel: Model<ServiceAvailabilityDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
    private readonly tx: TransactionService,
  ) {}

  /** Returns a per-day slice over [from, to], synthesizing defaults for gaps. */
  async range(serviceId: string, from: string, to: string): Promise<DayAvailability[]> {
    const service = await this.serviceModel
      .findOne({ _id: serviceId, deletedAt: null })
      .select({ basePrice: 1 })
      .lean()
      .exec();
    if (!service) throw new NotFoundException('Service not found');

    const days = this.enumerateDays(from, to);
    const rows = await this.availabilityModel
      .find({ serviceId, date: { $gte: this.toUtcDate(from), $lte: this.toUtcDate(to) } })
      .lean()
      .exec();
    const byDate = new Map(rows.map((r) => [this.dateKey(r.date), r]));

    return days.map((d) => {
      const row = byDate.get(d);
      if (row) {
        const qtyAvailable = Math.max(0, row.qtyTotal - row.qtyReserved);
        return {
          date: d,
          qtyTotal: row.qtyTotal,
          qtyReserved: row.qtyReserved,
          qtyAvailable,
          price: (row.priceOverride ?? service.basePrice).toString(),
          isClosed: row.isClosed,
          synthesized: false,
        };
      }
      // No explicit row → open by default with a single unit at base price.
      return {
        date: d,
        qtyTotal: 1,
        qtyReserved: 0,
        qtyAvailable: 1,
        price: service.basePrice.toString(),
        isClosed: false,
        synthesized: true,
      };
    });
  }

  /** Bulk upsert availability across [from, to]. */
  async setRange(serviceId: string, dto: SetAvailabilityDto): Promise<{ updated: number }> {
    await this.ensureService(serviceId);
    const days = this.enumerateDays(dto.from, dto.to);

    await this.tx.run(async (session) => {
      for (const d of days) {
        const date = this.toUtcDate(d);
        const set: Record<string, unknown> = {};
        if (dto.qtyTotal !== undefined) set.qtyTotal = dto.qtyTotal;
        if (dto.priceOverride !== undefined) set.priceOverride = toDecimal128(dto.priceOverride);
        if (dto.isClosed !== undefined) set.isClosed = dto.isClosed;

        const setOnInsert: Record<string, unknown> = {
          serviceId: new Types.ObjectId(serviceId),
          date,
          qtyReserved: 0,
        };
        if (dto.qtyTotal === undefined) setOnInsert.qtyTotal = 1;
        if (dto.priceOverride === undefined) setOnInsert.priceOverride = null;
        if (dto.isClosed === undefined) setOnInsert.isClosed = false;

        await this.availabilityModel.updateOne(
          { serviceId, date },
          { $set: set, $setOnInsert: setOnInsert },
          { upsert: true, session },
        );
      }
    });
    return { updated: days.length };
  }

  /** Override a single day. */
  async overrideDay(
    serviceId: string,
    dateStr: string,
    dto: OverrideDayDto,
  ): Promise<DayAvailability> {
    await this.ensureService(serviceId);
    const date = this.toUtcDate(dateStr);

    const set: Record<string, unknown> = {};
    if (dto.qtyTotal !== undefined) set.qtyTotal = dto.qtyTotal;
    if (dto.priceOverride !== undefined) set.priceOverride = toDecimal128(dto.priceOverride);
    if (dto.isClosed !== undefined) set.isClosed = dto.isClosed;

    const setOnInsert: Record<string, unknown> = {
      serviceId: new Types.ObjectId(serviceId),
      date,
      qtyReserved: 0,
    };
    if (dto.qtyTotal === undefined) setOnInsert.qtyTotal = 1;
    if (dto.priceOverride === undefined) setOnInsert.priceOverride = null;
    if (dto.isClosed === undefined) setOnInsert.isClosed = false;

    const row = await this.availabilityModel
      .findOneAndUpdate(
        { serviceId, date },
        { $set: set, $setOnInsert: setOnInsert },
        { upsert: true, new: true },
      )
      .lean()
      .exec();
    if (!row) throw new NotFoundException('Service availability not found');

    const service = await this.serviceModel
      .findById(serviceId)
      .select({ basePrice: 1 })
      .lean()
      .exec();
    if (!service) throw new NotFoundException('Service not found');

    return {
      date: this.dateKey(row.date),
      qtyTotal: row.qtyTotal,
      qtyReserved: row.qtyReserved,
      qtyAvailable: Math.max(0, row.qtyTotal - row.qtyReserved),
      price: (row.priceOverride ?? service.basePrice).toString(),
      isClosed: row.isClosed,
      synthesized: false,
    };
  }

  // -- Helpers ----------------------------------------------------------------

  private async ensureService(serviceId: string): Promise<void> {
    const found = await this.serviceModel
      .exists({ _id: serviceId, deletedAt: null })
      .then(Boolean);
    if (!found) throw new NotFoundException('Service not found');
  }

  /** Inclusive list of YYYY-MM-DD strings; rejects inverted or oversized ranges. */
  private enumerateDays(from: string, to: string): string[] {
    const start = this.toUtcDate(from);
    const end = this.toUtcDate(to);
    if (end.getTime() < start.getTime()) {
      throw new BusinessRuleException('`to` must be on or after `from`');
    }
    const days: string[] = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      days.push(this.dateKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      if (days.length > MAX_RANGE_DAYS) {
        throw new BusinessRuleException(`Date range may not exceed ${MAX_RANGE_DAYS} days`);
      }
    }
    return days;
  }

  /** Normalizes a YYYY-MM-DD string to a UTC midnight Date (matches date-only storage). */
  private toUtcDate(s: string): Date {
    return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
  }

  private dateKey(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
