import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { BookingStatus, ServiceStatus, UserRole } from '../../common/enums';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import {
  ServiceRoom,
  ServiceRoomDocument,
} from '../../database/schemas/service-room.schema';
import {
  ServiceAvailability,
  ServiceAvailabilityDocument,
} from '../../database/schemas/service-availability.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileDocument,
} from '../../database/schemas/service-provider-profile.schema';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Currency, CurrencyDocument } from '../../database/schemas/currency.schema';
import { TransactionService } from '../../database/transaction.service';
import { toRecord } from '../../database/schemas/schema.helpers';
import { toDecimal, toDecimal128 } from '../../common/utils/money.util';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { escapeRegExp } from '../../common/utils/regex.util';
import { clampPagination, buildPaginationMeta } from '../../common/utils/pagination';
import { BookingsPricingService } from './bookings-pricing.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

/** Allowed actor-to-status transitions. */
const CANCEL_STATUSES = new Set<BookingStatus>([
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
]);

/** Generates a human-readable reference code, e.g. BK-A3F8B2C1. */
function generateReferenceCode(prefix = 'BK'): string {
  return `${prefix}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(ServiceRoom.name)
    private readonly serviceRoomModel: Model<ServiceRoomDocument>,
    @InjectModel(ServiceAvailability.name)
    private readonly availabilityModel: Model<ServiceAvailabilityDocument>,
    @InjectModel(ServiceProviderProfile.name)
    private readonly providerModel: Model<ServiceProviderProfileDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Currency.name) private readonly currencyModel: Model<CurrencyDocument>,
    private readonly tx: TransactionService,
    private readonly pricingService: BookingsPricingService,
  ) {}

  // ─── Create ───────────────────────────────────────────────────────────────

  async create(customerId: string, dto: CreateBookingDto) {
    const service = await this.serviceModel
      .findOne({ _id: dto.serviceId, deletedAt: null, status: ServiceStatus.ACTIVE })
      .lean()
      .exec();
    if (!service) throw new NotFoundException('Service not found or not available');

    // Rooms are now a separate collection referenced by serviceId.
    const rooms = await this.serviceRoomModel
      .find({ serviceId: service._id })
      .lean()
      .exec();

    const checkIn = dto.checkInDate ? new Date(dto.checkInDate) : null;
    const checkOut = dto.checkOutDate ? new Date(dto.checkOutDate) : null;

    if (checkIn && checkOut && checkIn >= checkOut) {
      throw new BadRequestException('checkOutDate must be after checkInDate');
    }

    // Resolve requested rooms
    const roomRequests = dto.rooms ?? [];
    const resolvedRooms = roomRequests.map((rr) => {
      const room = rooms.find((r) => r._id.toString() === rr.roomId);
      if (!room) {
        throw new NotFoundException(`Room ${rr.roomId} not found on this service`);
      }
      return { ...room, qty: rr.qty };
    });

    // Compute price
    let currencyRate: number | undefined;
    if (dto.currency && dto.currency !== 'MGA') {
      const ccy = await this.currencyModel
        .findById(dto.currency)
        .select({ rateToMga: 1, isActive: 1 })
        .lean()
        .exec();
      if (!ccy || !ccy.isActive) {
        throw new BadRequestException(`Currency ${dto.currency} is not available`);
      }
      currencyRate = toDecimal(ccy.rateToMga).toNumber();
    }

    const priceResult = this.pricingService.compute({
      serviceId: service._id.toString(),
      basePrice: service.basePrice,
      discounts: service.discounts as never,
      rooms: resolvedRooms.map((r) => ({
        name: r.name,
        basePrice: r.basePrice,
        qty: r.qty,
      })),
      units: dto.units ?? 1,
      checkInDate: checkIn,
      currency: dto.currency,
      currencyRate,
    });

    // Availability check + decrement (conditional UPDATE prevents oversell race
    // condition) and booking persistence happen atomically in one transaction.
    const booking = await this.tx.run(async (session) => {
      if (checkIn) {
        await this.reserveAvailability(service._id, checkIn, session);
      }

      const [created] = await this.bookingModel.create(
        [
          {
            referenceCode: generateReferenceCode('BK'),
            customerId,
            serviceId: service._id,
            providerId: service.providerId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            units: dto.units ?? 1,
            adults: dto.adults ?? 1,
            childrenAges: dto.childrenAges ?? null,
            guests: dto.guests ?? [],
            lineItems: priceResult.lineItems,
            subtotal: toDecimal128(priceResult.subtotal),
            discountAmount: toDecimal128(priceResult.discountAmount),
            taxAmount: toDecimal128(priceResult.taxAmount),
            feeAmount: toDecimal128(priceResult.feeAmount),
            total: toDecimal128(priceResult.total),
            currency: priceResult.currency,
            exchangeRateToMga: priceResult.exchangeRateToMga
              ? toDecimal128(priceResult.exchangeRateToMga)
              : null,
            notes: dto.notes ?? null,
            status: BookingStatus.PENDING,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h PENDING TTL
            rooms: resolvedRooms.map((r) => ({
              roomId: r._id,
              qty: r.qty,
              unitPrice: toDecimal128(r.basePrice),
              currency: priceResult.currency,
            })),
          },
        ],
        { session },
      );

      return created;
    });

    return this.serialize(await this.hydrate(booking._id));
  }

  /**
   * Reserves one unit of availability for `date`, guarding against oversell:
   * a conditional updateOne increments qtyReserved only when a slot remains and
   * the date isn't closed. If matchedCount === 0 we inspect the row to decide
   * whether to synthesize a default slot (no row), or abort (closed / sold out).
   */
  private async reserveAvailability(
    serviceId: Types.ObjectId,
    date: Date,
    session: ClientSession,
  ): Promise<void> {
    const res = await this.availabilityModel.updateOne(
      {
        serviceId,
        date,
        isClosed: false,
        $expr: { $lt: ['$qtyReserved', '$qtyTotal'] },
      },
      { $inc: { qtyReserved: 1 } },
      { session },
    );

    if (res.matchedCount === 0) {
      const row = await this.availabilityModel
        .findOne({ serviceId, date })
        .session(session)
        .exec();
      if (!row) {
        // No row yet → synthesized default slot; create and reserve it.
        await this.availabilityModel.create(
          [{ serviceId, date, qtyTotal: 1, qtyReserved: 1 }],
          { session },
        );
      } else if (row.isClosed) {
        throw new BusinessRuleException('This date is closed for bookings', {
          code: 'SERVICE_DATE_CLOSED',
        });
      } else {
        throw new BusinessRuleException(
          'No availability remaining for the selected date',
          { code: 'NO_AVAILABILITY' },
        );
      }
    }
  }

  // ─── Customer: my bookings ────────────────────────────────────────────────

  async findMine(customerId: string, dto: QueryBookingsDto) {
    const { skip, take, page, limit } = clampPagination(dto.page, dto.limit);

    const where: FilterQuery<BookingDocument> = {
      customerId,
      deletedAt: null,
      ...(dto.status ? { status: dto.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.bookingModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.bookingModel.countDocuments(where).exec(),
    ]);

    const data = await Promise.all(items.map((b) => this.serializeWithRefs(b)));
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  // ─── Single booking ───────────────────────────────────────────────────────

  async findOne(id: string, actorId: string, actorRole: UserRole) {
    const booking = await this.bookingModel
      .findOne({ _id: id, deletedAt: null })
      .lean()
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');

    // Customers see only their own; providers see bookings for their services
    if (actorRole === UserRole.CUSTOMER && booking.customerId.toString() !== actorId) {
      throw new ForbiddenException();
    }
    if (actorRole === UserRole.SERVICE_PROVIDER) {
      const provider = await this.providerModel
        .findOne({ userId: actorId })
        .select({ _id: 1 })
        .lean()
        .exec();
      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        throw new ForbiddenException();
      }
    }

    return this.serializeWithRefs(booking, true);
  }

  // ─── Cancel ───────────────────────────────────────────────────────────────

  async cancel(
    id: string,
    actorId: string,
    actorRole: UserRole,
    reason?: string,
  ) {
    const booking = await this.bookingModel
      .findOne({ _id: id, deletedAt: null })
      .lean()
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');

    if (actorRole === UserRole.CUSTOMER && booking.customerId.toString() !== actorId) {
      throw new ForbiddenException();
    }
    if (!CANCEL_STATUSES.has(booking.status)) {
      throw new BusinessRuleException(
        `Cannot cancel a booking with status ${booking.status}`,
        { code: 'INVALID_STATUS_TRANSITION' },
      );
    }

    await this.bookingModel
      .updateOne(
        { _id: id },
        {
          $set: {
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: reason ?? null,
          },
        },
      )
      .exec();

    return this.serializeWithRefs(await this.findLean(id));
  }

  // ─── Admin: list all bookings ─────────────────────────────────────────────

  async adminList(dto: QueryBookingsDto) {
    const { skip, take, page, limit } = clampPagination(dto.page, dto.limit);

    const where: FilterQuery<BookingDocument> = {
      deletedAt: null,
      ...(dto.status ? { status: dto.status } : {}),
    };

    if (dto.query) {
      const rx = new RegExp(escapeRegExp(dto.query), 'i');
      const matchingCustomers = await this.userModel
        .find({ email: rx })
        .select({ _id: 1 })
        .lean()
        .exec();
      const customerIds = matchingCustomers.map((u) => u._id);
      where.$or = [{ referenceCode: rx }, { customerId: { $in: customerIds } }];
    }

    const [items, total] = await Promise.all([
      this.bookingModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.bookingModel.countDocuments(where).exec(),
    ]);

    const data = await Promise.all(items.map((b) => this.serializeWithRefs(b, true)));
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  // ─── Provider: list bookings for their services ──────────────────────────

  async providerList(providerUserId: string, dto: QueryBookingsDto) {
    const provider = await this.providerModel
      .findOne({ userId: providerUserId })
      .select({ _id: 1 })
      .lean()
      .exec();
    if (!provider) throw new NotFoundException('Provider profile not found');

    const { skip, take, page, limit } = clampPagination(dto.page, dto.limit);

    const where: FilterQuery<BookingDocument> = {
      providerId: provider._id,
      deletedAt: null,
      ...(dto.status ? { status: dto.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.bookingModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.bookingModel.countDocuments(where).exec(),
    ]);

    const data = await Promise.all(items.map((b) => this.serializeWithRefs(b)));
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  // ─── Admin: update status ─────────────────────────────────────────────────

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.bookingModel
      .findOne({ _id: id, deletedAt: null })
      .lean()
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingModel
      .updateOne(
        { _id: id },
        {
          $set: {
            status: dto.status,
            ...(dto.status === BookingStatus.CONFIRMED ? { confirmedAt: new Date() } : {}),
            ...(dto.status === BookingStatus.CANCELLED
              ? { cancelledAt: new Date(), cancellationReason: dto.cancellationReason ?? null }
              : {}),
          },
        },
      )
      .exec();

    return this.serializeWithRefs(await this.findLean(id), true);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findLean(id: string | Types.ObjectId) {
    const booking = await this.bookingModel.findById(id).lean().exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  /** Loads a freshly-created booking as a lean record. */
  private async hydrate(id: Types.ObjectId) {
    return this.findLean(id);
  }

  /**
   * Resolves the referenced service, rooms and payments for a lean booking,
   * mirroring the former Prisma `include`, then serializes money fields.
   */
  private async serializeWithRefs(
    booking: Record<string, any>,
    withCustomer = false,
  ) {
    const [service, payments, customer] = await Promise.all([
      this.serviceModel
        .findById(booking.serviceId)
        .select({ slug: 1, name: 1, basePrice: 1, currency: 1 })
        .lean()
        .exec(),
      this.paymentModel
        .find({ bookingId: booking._id })
        .select({ status: 1, amount: 1, currency: 1, method: 1 })
        .lean()
        .exec(),
      withCustomer
        ? this.userModel
            .findById(booking.customerId)
            .select({ name: 1, email: 1 })
            .lean()
            .exec()
        : Promise.resolve(null),
    ]);

    // Attach room names for the embedded booking rooms.
    const roomIds = (booking.rooms ?? []).map((r: any) => r.roomId);
    const roomDocs = roomIds.length
      ? await this.serviceRoomModel
          .find({ _id: { $in: roomIds } })
          .select({ name: 1 })
          .lean()
          .exec()
      : [];
    const roomNameById = new Map(roomDocs.map((r) => [r._id.toString(), r.name]));

    return this.serialize({
      ...booking,
      service: service ?? undefined,
      payments,
      customer: customer ?? undefined,
      rooms: (booking.rooms ?? []).map((r: any) => ({
        ...r,
        room: roomNameById.has(r.roomId?.toString())
          ? { id: r.roomId.toString(), name: roomNameById.get(r.roomId.toString()) }
          : undefined,
      })),
    });
  }

  // ─── Serializer ───────────────────────────────────────────────────────────

  private serialize(booking: any) {
    const rec = booking?._id ? toRecord(booking) : booking;
    return {
      ...rec,
      subtotal: rec.subtotal?.toString(),
      discountAmount: rec.discountAmount?.toString(),
      taxAmount: rec.taxAmount?.toString(),
      feeAmount: rec.feeAmount?.toString(),
      total: rec.total?.toString(),
      exchangeRateToMga: rec.exchangeRateToMga?.toString() ?? null,
      rooms: rec.rooms?.map((r: any) => ({
        ...r,
        unitPrice: r.unitPrice?.toString(),
      })),
      payments: rec.payments?.map((p: any) => ({
        ...(p?._id ? toRecord(p) : p),
        amount: p.amount?.toString(),
      })),
      service: rec.service
        ? {
            ...(rec.service?._id ? toRecord(rec.service) : rec.service),
            basePrice: rec.service.basePrice?.toString(),
          }
        : undefined,
      customer: rec.customer
        ? rec.customer?._id
          ? toRecord(rec.customer)
          : rec.customer
        : undefined,
    };
  }
}
