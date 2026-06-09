import { NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TokenService } from '../auth/token.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let tokens: DeepMockProxy<TokenService>;
  let service: UsersService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    tokens = mockDeep<TokenService>();
    service = new UsersService(prisma, tokens);
  });

  describe('list', () => {
    it('applies role, isActive and search filters and excludes soft-deleted users', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as any);
      await service.list({ role: UserRole.CUSTOMER, isActive: true, query: 'jane', page: 1, limit: 10 });

      const findManyArg = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
      expect(findManyArg.where).toMatchObject({
        deletedAt: null,
        role: UserRole.CUSTOMER,
        isActive: true,
      });
      expect(findManyArg.where.OR).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.anything() }),
          expect.objectContaining({ email: expect.anything() }),
        ]),
      );
      // password hash never selected
      expect(findManyArg.select).not.toHaveProperty('passwordHash');
    });

    it('defaults to createdAt desc when sort is absent', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as any);
      await service.list({ page: 1, limit: 10 });
      const findManyArg = (prisma.user.findMany as jest.Mock).mock.calls[0][0];
      expect(findManyArg.orderBy).toEqual({ createdAt: 'desc' });
    });
  });

  describe('getById', () => {
    it('throws NotFound for a missing/deleted user', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.getById('x')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('setStatus', () => {
    it('revokes sessions when deactivating', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' } as any);
      prisma.user.update.mockResolvedValue({ id: 'u1', isActive: false } as any);
      await service.setStatus('u1', false);
      expect(tokens.revokeAllForUser).toHaveBeenCalledWith('u1');
    });

    it('does NOT revoke sessions when activating', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' } as any);
      prisma.user.update.mockResolvedValue({ id: 'u1', isActive: true } as any);
      await service.setStatus('u1', true);
      expect(tokens.revokeAllForUser).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('sets deletedAt + isActive=false and revokes sessions', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' } as any);
      prisma.user.update.mockResolvedValue({} as any);
      await service.softDelete('u1');

      const updateArg = (prisma.user.update as jest.Mock).mock.calls[0][0];
      expect(updateArg.data.deletedAt).toBeInstanceOf(Date);
      expect(updateArg.data.isActive).toBe(false);
      expect(tokens.revokeAllForUser).toHaveBeenCalledWith('u1');
    });

    it('throws NotFound when the user does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.softDelete('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('assignRole', () => {
    it('updates the role', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' } as any);
      prisma.user.update.mockResolvedValue({ id: 'u1', role: UserRole.SERVICE_PROVIDER } as any);
      const result = await service.assignRole('u1', UserRole.SERVICE_PROVIDER);
      expect(result.role).toBe(UserRole.SERVICE_PROVIDER);
    });
  });
});
