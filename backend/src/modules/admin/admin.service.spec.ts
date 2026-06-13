import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { AuditLogDocument } from '../../database/schemas/audit-log.schema';
import { BookingDocument } from '../../database/schemas/booking.schema';
import { CategoryDocument } from '../../database/schemas/category.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceProviderProfileDocument } from '../../database/schemas/service-provider-profile.schema';
import { UserDocument } from '../../database/schemas/user.schema';
import { AdminService } from './admin.service';

function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

function aggChain(value: unknown) {
  return { exec: jest.fn().mockResolvedValue(value) };
}

describe('AdminService', () => {
  let userModel: DeepMockProxy<Model<UserDocument>>;
  let providerModel: DeepMockProxy<Model<ServiceProviderProfileDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let bookingModel: DeepMockProxy<Model<BookingDocument>>;
  let categoryModel: DeepMockProxy<Model<CategoryDocument>>;
  let auditLogModel: DeepMockProxy<Model<AuditLogDocument>>;
  let service: AdminService;

  beforeEach(() => {
    userModel = mockDeep<Model<UserDocument>>();
    providerModel = mockDeep<Model<ServiceProviderProfileDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    bookingModel = mockDeep<Model<BookingDocument>>();
    categoryModel = mockDeep<Model<CategoryDocument>>();
    auditLogModel = mockDeep<Model<AuditLogDocument>>();
    service = new AdminService(
      userModel,
      providerModel,
      serviceModel,
      bookingModel,
      categoryModel,
      auditLogModel,
    );
  });

  describe('overview', () => {
    it('returns aggregated platform counts', async () => {
      userModel.countDocuments.mockReturnValue(queryChain(100) as never);
      providerModel.countDocuments.mockReturnValue(queryChain(20) as never);
      serviceModel.countDocuments
        .mockReturnValueOnce(queryChain(50) as never)
        .mockReturnValueOnce(queryChain(40) as never);
      bookingModel.countDocuments
        .mockReturnValueOnce(queryChain(10) as never) // total
        .mockReturnValueOnce(queryChain(3) as never) // pending
        .mockReturnValueOnce(queryChain(5) as never) // confirmed
        .mockReturnValueOnce(queryChain(1) as never) // cancelled
        .mockReturnValueOnce(queryChain(1) as never); // completed
      bookingModel.aggregate.mockReturnValue(
        aggChain([{ _id: null, total: Types.Decimal128.fromString('500000') }]) as never,
      );

      const result = await service.overview({});

      expect(result.users.total).toBe(100);
      expect(result.providers.verified).toBe(20);
      expect(result.services.total).toBe(50);
      expect(result.bookings.total).toBe(10);
      expect(result.revenue.totalMga).toBe('500000');
      expect(result.window).toBeDefined();
    });

    it('uses provided from/to window', async () => {
      userModel.countDocuments.mockReturnValue(queryChain(0) as never);
      providerModel.countDocuments.mockReturnValue(queryChain(0) as never);
      serviceModel.countDocuments.mockReturnValue(queryChain(0) as never);
      bookingModel.countDocuments.mockReturnValue(queryChain(0) as never);
      bookingModel.aggregate.mockReturnValue(aggChain([]) as never);

      const result = await service.overview({ from: '2025-01-01', to: '2025-06-01' });

      expect(result.window.from).toContain('2025-01-01');
      expect(result.window.to).toContain('2025-06-01');
      expect(result.revenue.totalMga).toBe('0');
    });
  });

  describe('recentActivity', () => {
    it('returns up to the requested limit of audit log entries', async () => {
      const actorId = new Types.ObjectId();
      const fakeLog = {
        _id: new Types.ObjectId(),
        actorId,
        action: 'CREATE',
        entity: 'Service',
        entityId: 's1',
        ip: '127.0.0.1',
        createdAt: new Date(),
      };
      auditLogModel.find.mockReturnValue(queryChain([fakeLog]) as never);
      userModel.find.mockReturnValue(
        queryChain([
          { _id: actorId, name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
        ]) as never,
      );

      const result = await service.recentActivity({ limit: 5 });

      expect(result).toHaveLength(1);
      expect(result[0].action).toBe('CREATE');
      expect(result[0].actor?.email).toBe('admin@test.com');
    });

    it('clamps limit to 100', async () => {
      auditLogModel.find.mockReturnValue(queryChain([]) as never);
      await service.recentActivity({ limit: 999 });

      const chain = auditLogModel.find.mock.results[0].value as Record<string, jest.Mock>;
      expect(chain.limit).toHaveBeenCalledWith(100);
    });
  });

  describe('recentServiceOwners', () => {
    it('returns provider profile summaries', async () => {
      const profileId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      providerModel.find.mockReturnValue(
        queryChain([
          {
            _id: profileId,
            businessName: 'Sunset Tours',
            isVerified: true,
            createdAt: new Date(),
            userId,
          },
        ]) as never,
      );
      userModel.find.mockReturnValue(
        queryChain([
          { _id: userId, name: 'Alice', email: 'alice@tours.com', role: 'PROVIDER' },
        ]) as never,
      );
      serviceModel.aggregate.mockReturnValue(
        aggChain([{ _id: profileId, count: 5 }]) as never,
      );

      const result = await service.recentServiceOwners(5);

      expect(result).toHaveLength(1);
      expect(result[0].businessName).toBe('Sunset Tours');
      expect(result[0].serviceCount).toBe(5);
    });
  });
});
