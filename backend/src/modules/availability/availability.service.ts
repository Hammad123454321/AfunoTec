import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

  /** Returns a per-day slice over [from, to], synthesizing defaults for gaps. */
  async range(serviceId: string, from: string, to: string): Promise<DayAvailability[]> {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, deletedAt: null },
      select: { id: true, basePrice: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const days = this.enumerateDays(from, to);
    const rows = await this.prisma.serviceAvailability.findMany({
      where: { serviceId, date: { gte: this.toUtcDate(from), lte: this.toUtcDate(to) } },
    });
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

    await this.prisma.$transaction(
      days.map((d) => {
        const date = this.toUtcDate(d);
        const update: Prisma.ServiceAvailabilityUpdateInput = {};
        const baseCreate = { qtyTotal: 1, qtyReserved: 0, isClosed: false };
        if (dto.qtyTotal !== undefined) update.qtyTotal = dto.qtyTotal;
        if (dto.priceOverride !== undefined)
          update.priceOverride = new Prisma.Decimal(dto.priceOverride);
        if (dto.isClosed !== undefined) update.isClosed = dto.isClosed;

        return this.prisma.serviceAvailability.upsert({
          where: { serviceId_date: { serviceId, date } },
          update,
          create: {
            serviceId,
            date,
            qtyTotal: dto.qtyTotal ?? baseCreate.qtyTotal,
            priceOverride:
              dto.priceOverride !== undefined ? new Prisma.Decimal(dto.priceOverride) : null,
            isClosed: dto.isClosed ?? baseCreate.isClosed,
          },
        });
      }),
    );
    return { updated: days.length };
  }

  /** Override a single day. */
  async overrideDay(serviceId: string, dateStr: string, dto: OverrideDayDto): Promise<DayAvailability> {
    await this.ensureService(serviceId);
    const date = this.toUtcDate(dateStr);

    const row = await this.prisma.serviceAvailability.upsert({
      where: { serviceId_date: { serviceId, date } },
      update: {
        ...(dto.qtyTotal !== undefined && { qtyTotal: dto.qtyTotal }),
        ...(dto.priceOverride !== undefined && {
          priceOverride: new Prisma.Decimal(dto.priceOverride),
        }),
        ...(dto.isClosed !== undefined && { isClosed: dto.isClosed }),
      },
      create: {
        serviceId,
        date,
        qtyTotal: dto.qtyTotal ?? 1,
        priceOverride:
          dto.priceOverride !== undefined ? new Prisma.Decimal(dto.priceOverride) : null,
        isClosed: dto.isClosed ?? false,
      },
    });

    const service = await this.prisma.service.findUniqueOrThrow({
      where: { id: serviceId },
      select: { basePrice: true },
    });
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
    const found = await this.prisma.service.findFirst({
      where: { id: serviceId, deletedAt: null },
      select: { id: true },
    });
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

  /** Normalizes a YYYY-MM-DD string to a UTC midnight Date (matches @db.Date). */
  private toUtcDate(s: string): Date {
    return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
  }

  private dateKey(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
