import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { PaymentStatus, BookingStatus } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { TransactionService } from '../../database/transaction.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import {
  buildPaginationMeta,
  clampPagination,
} from '../../common/utils/pagination';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly tx: TransactionService,
  ) {}

  /**
   * Creates a Payment document in INITIATED state.
   * Actual gateway call is deferred to Milestone 4 — returns 501.
   */
  async initiate(
    userId: string,
    dto: InitiatePaymentDto,
  ): Promise<{ paymentId: string; status: string; gatewayUrl: string | null }> {
    const booking = await this.bookingModel
      .findOne({ _id: dto.bookingId, customerId: userId, deletedAt: null })
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BusinessRuleException(
        'BOOKING_NOT_PAYABLE',
        `Booking status ${booking.status} is not payable`,
      );
    }

    await this.paymentModel.create({
      bookingId: booking._id,
      userId,
      method: dto.method,
      amount: booking.total,
      currency: booking.currency,
      status: PaymentStatus.INITIATED,
    });

    // Gateway integration is Milestone 4
    throw new NotImplementedException(
      'Payment gateway integration is not yet available (Milestone 4)',
    );
  }

  /** Webhook handler stub — Milestone 4. */
  async handleWebhook(_payload: unknown): Promise<void> {
    throw new NotImplementedException('Payment webhook is not yet implemented (Milestone 4)');
  }

  /** Refund stub — Milestone 4. */
  async refund(_paymentId: string, _actorId: string): Promise<void> {
    throw new NotImplementedException('Refund is not yet implemented (Milestone 4)');
  }

  async findOne(id: string, userId: string, userRole: string) {
    const payment = await this.paymentModel.findById(id).lean().exec();
    if (!payment) throw new NotFoundException('Payment not found');
    if (userRole === 'CUSTOMER' && payment.userId.toString() !== userId) {
      throw new NotFoundException('Payment not found');
    }

    const booking = payment.bookingId
      ? await this.bookingModel
          .findById(payment.bookingId)
          .select('referenceCode status')
          .lean()
          .exec()
      : null;

    const record = toRecord(payment);
    return {
      ...record,
      amount: payment.amount.toString(),
      refundedAmount: payment.refundedAmount?.toString() ?? null,
      booking: booking
        ? {
            id: booking._id.toString(),
            referenceCode: booking.referenceCode,
            status: booking.status,
          }
        : null,
    };
  }

  async adminList(page?: number, limit?: number, status?: string) {
    const { skip, take, page: p, limit: l } = clampPagination(page, limit);
    const where: FilterQuery<PaymentDocument> = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.paymentModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.paymentModel.countDocuments(where).exec(),
    ]);

    const bookingIds = data
      .map((d) => d.bookingId)
      .filter((b): b is NonNullable<typeof b> => b != null);
    const bookings = bookingIds.length
      ? await this.bookingModel
          .find({ _id: { $in: bookingIds } })
          .select('referenceCode')
          .lean()
          .exec()
      : [];
    const bookingById = new Map(bookings.map((b) => [b._id.toString(), b]));

    return {
      data: data.map((payment) => {
        const record = toRecord(payment);
        const booking = payment.bookingId
          ? bookingById.get(payment.bookingId.toString())
          : undefined;
        return {
          ...record,
          amount: payment.amount.toString(),
          booking: booking
            ? { id: booking._id.toString(), referenceCode: booking.referenceCode }
            : null,
        };
      }),
      meta: buildPaginationMeta(total, p, l),
    };
  }
}
