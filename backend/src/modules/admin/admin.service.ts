import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingStatus, ServiceStatus } from '../../common/enums';
import {
  AuditLog,
  AuditLogDocument,
} from '../../database/schemas/audit-log.schema';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import {
  Category,
  CategoryDocument,
} from '../../database/schemas/category.schema';
import {
  Service,
  ServiceDocument,
} from '../../database/schemas/service.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileDocument,
} from '../../database/schemas/service-provider-profile.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { toDecimal } from '../../common/utils/money.util';
import { clampPagination, buildPaginationMeta, Paginated } from '../../common/utils/pagination';
import { MetricsQueryDto } from './dto/metrics-query.dto';
import { RecentActivityQueryDto } from './dto/recent-activity-query.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ServiceProviderProfile.name)
    private readonly providerModel: Model<ServiceProviderProfileDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  private window(dto: MetricsQueryDto): { from: Date; to: Date } {
    const to = dto.to ? new Date(dto.to) : new Date();
    const from = dto.from
      ? new Date(dto.from)
      : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to };
  }

  async overview(dto: MetricsQueryDto) {
    const { from, to } = this.window(dto);
    const inWindow = { createdAt: { $gte: from, $lte: to } };

    const [
      totalUsers,
      newUsers,
      totalProviders,
      totalServices,
      activeServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      revenueAgg,
    ] = await Promise.all([
      this.userModel.countDocuments({ deletedAt: null }).exec(),
      this.userModel.countDocuments({ deletedAt: null, ...inWindow }).exec(),
      this.providerModel.countDocuments({ isVerified: true }).exec(),
      this.serviceModel.countDocuments({ deletedAt: null }).exec(),
      this.serviceModel
        .countDocuments({ deletedAt: null, status: ServiceStatus.ACTIVE })
        .exec(),
      this.bookingModel.countDocuments({ deletedAt: null, ...inWindow }).exec(),
      this.bookingModel
        .countDocuments({ deletedAt: null, status: BookingStatus.PENDING, ...inWindow })
        .exec(),
      this.bookingModel
        .countDocuments({ deletedAt: null, status: BookingStatus.CONFIRMED, ...inWindow })
        .exec(),
      this.bookingModel
        .countDocuments({ deletedAt: null, status: BookingStatus.CANCELLED, ...inWindow })
        .exec(),
      this.bookingModel
        .countDocuments({ deletedAt: null, status: BookingStatus.COMPLETED, ...inWindow })
        .exec(),
      this.bookingModel
        .aggregate<{ _id: null; total: Types.Decimal128 }>([
          {
            $match: {
              deletedAt: null,
              status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
              createdAt: { $gte: from, $lte: to },
            },
          },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ])
        .exec(),
    ]);

    const revenueTotal = revenueAgg[0]?.total;

    return {
      window: { from: from.toISOString(), to: to.toISOString() },
      users: { total: totalUsers, new: newUsers },
      providers: { verified: totalProviders },
      services: { total: totalServices, active: activeServices },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
      },
      revenue: {
        totalMga: revenueTotal != null ? toDecimal(revenueTotal).toString() : '0',
        currency: 'MGA',
      },
    };
  }

  async categoryBreakdown(dto: MetricsQueryDto) {
    const { from, to } = this.window(dto);

    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ name: 'asc' })
      .lean()
      .exec();

    // Service counts per active category (non-deleted services).
    const serviceCounts = await this.serviceModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        { $match: { deletedAt: null } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      ])
      .exec();
    const serviceCountByCat = new Map<string, number>(
      serviceCounts.map((row) => [row._id?.toString(), row.count]),
    );

    // Booking counts per service in the window.
    const bookingsByService = await this.bookingModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        { $match: { deletedAt: null, createdAt: { $gte: from, $lte: to } } },
        { $group: { _id: '$serviceId', count: { $sum: 1 } } },
      ])
      .exec();

    // Map serviceId → categoryId.
    const serviceIds = bookingsByService.map((b) => b._id).filter(Boolean);
    const services = serviceIds.length
      ? await this.serviceModel
          .find({ _id: { $in: serviceIds } })
          .select({ categoryId: 1 })
          .lean()
          .exec()
      : [];
    const serviceToCategory = new Map<string, string>(
      services.map((s) => [s._id.toString(), s.categoryId?.toString()]),
    );

    const bookingsByCat = new Map<string, number>();
    for (const row of bookingsByService) {
      const catId = serviceToCategory.get(row._id?.toString());
      if (catId) {
        bookingsByCat.set(catId, (bookingsByCat.get(catId) ?? 0) + row.count);
      }
    }

    return categories.map((cat) => {
      const id = cat._id.toString();
      return {
        id,
        slug: cat.slug,
        name: cat.name,
        serviceCount: serviceCountByCat.get(id) ?? 0,
        bookingsInWindow: bookingsByCat.get(id) ?? 0,
      };
    });
  }

  async recentActivity(dto: RecentActivityQueryDto) {
    const limit = Math.min(100, Math.max(1, dto.limit ?? 20));
    const filter = dto.entity ? { entity: dto.entity } : {};

    const logs = await this.auditLogModel
      .find(filter)
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .select({ actorId: 1, action: 1, entity: 1, entityId: 1, ip: 1, createdAt: 1 })
      .lean()
      .exec();

    const actorIds = [
      ...new Set(logs.map((l) => l.actorId?.toString()).filter(Boolean) as string[]),
    ];
    const actors = actorIds.length
      ? await this.userModel
          .find({ _id: { $in: actorIds } })
          .select({ name: 1, email: 1, role: 1 })
          .lean()
          .exec()
      : [];
    const actorById = new Map(actors.map((a) => [a._id.toString(), a]));

    return logs.map((entry) => {
      const log = entry as typeof entry & { createdAt: Date };
      const actor = log.actorId ? actorById.get(log.actorId.toString()) : undefined;
      return {
        id: log._id.toString(),
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        ip: log.ip,
        createdAt: log.createdAt,
        actor: actor
          ? {
              id: actor._id.toString(),
              name: actor.name,
              email: actor.email,
              role: actor.role,
            }
          : null,
      };
    });
  }

  async auditLog(dto: {
    entity?: string;
    actorId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<Paginated<Record<string, unknown>>> {
    const { skip, take, page, limit } = clampPagination(dto.page, dto.limit);
    const filter: Record<string, unknown> = {};
    if (dto.entity) filter.entity = dto.entity;
    if (dto.actorId) filter.actorId = dto.actorId;
    if (dto.from || dto.to) {
      const createdAt: Record<string, Date> = {};
      if (dto.from) createdAt.$gte = new Date(dto.from);
      if (dto.to) createdAt.$lte = new Date(dto.to);
      filter.createdAt = createdAt;
    }

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.auditLogModel.countDocuments(filter).exec(),
    ]);

    const actorIds = [
      ...new Set(logs.map((l) => l.actorId?.toString()).filter(Boolean) as string[]),
    ];
    const actors = actorIds.length
      ? await this.userModel
          .find({ _id: { $in: actorIds } })
          .select({ name: 1, email: 1 })
          .lean()
          .exec()
      : [];
    const actorById = new Map(actors.map((a) => [a._id.toString(), a]));

    const data: Record<string, unknown>[] = logs.map((log) => {
      const actor = log.actorId ? actorById.get(log.actorId.toString()) : undefined;
      return {
        ...log,
        id: log._id.toString(),
        actor: actor
          ? { id: actor._id.toString(), name: actor.name, email: actor.email }
          : null,
      };
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async recentServiceOwners(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, limit));

    const profiles = await this.providerModel
      .find()
      .sort({ createdAt: 'desc' })
      .limit(safeLimit)
      .select({ businessName: 1, isVerified: 1, createdAt: 1, userId: 1 })
      .lean()
      .exec();

    const userIds = [
      ...new Set(profiles.map((p) => p.userId?.toString()).filter(Boolean) as string[]),
    ];
    const [users, serviceCounts] = await Promise.all([
      userIds.length
        ? this.userModel
            .find({ _id: { $in: userIds } })
            .select({ name: 1, email: 1, role: 1 })
            .lean()
            .exec()
        : Promise.resolve([]),
      profiles.length
        ? this.serviceModel
            .aggregate<{ _id: Types.ObjectId; count: number }>([
              { $match: { providerId: { $in: profiles.map((p) => p._id) } } },
              { $group: { _id: '$providerId', count: { $sum: 1 } } },
            ])
            .exec()
        : Promise.resolve([]),
    ]);
    const userById = new Map(users.map((u) => [u._id.toString(), u]));
    const countByProvider = new Map<string, number>(
      serviceCounts.map((row) => [row._id?.toString(), row.count]),
    );

    return profiles.map((profile) => {
      const p = profile as typeof profile & { createdAt: Date };
      const user = p.userId ? userById.get(p.userId.toString()) : undefined;
      return {
        profileId: p._id.toString(),
        businessName: p.businessName,
        isVerified: p.isVerified,
        joinedAt: p.createdAt,
        serviceCount: countByProvider.get(p._id.toString()) ?? 0,
        user: user
          ? { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
          : null,
      };
    });
  }
}
