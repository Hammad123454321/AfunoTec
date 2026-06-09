import { ConflictException, NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProvidersService } from './providers.service';

describe('ProvidersService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: ProvidersService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new ProvidersService(prisma);
  });

  describe('onboard', () => {
    it('rejects a user who already has a provider profile (409)', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue({ id: 'spp1' } as any);
      await expect(
        service.onboard('u1', { businessName: 'Biz' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates the profile and flips the user role in one transaction', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue(null);
      const txCreate = jest.fn().mockResolvedValue({ id: 'spp1', userId: 'u1' });
      const txUserUpdate = jest.fn().mockResolvedValue({});
      prisma.$transaction.mockImplementation(async (cb: any) =>
        cb({
          serviceProviderProfile: { create: txCreate },
          user: { update: txUserUpdate },
        }),
      );

      const result = await service.onboard('u1', { businessName: 'Baobab' });

      expect(txCreate).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ userId: 'u1', businessName: 'Baobab' }) }),
      );
      expect(txUserUpdate).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { role: 'SERVICE_PROVIDER' },
      });
      expect(result.id).toBe('spp1');
    });
  });

  describe('getMine', () => {
    it('throws NotFound when the caller has no profile', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue(null);
      await expect(service.getMine('u1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('verify', () => {
    it('sets isVerified + verifiedAt', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue({ id: 'spp1' } as any);
      prisma.serviceProviderProfile.update.mockResolvedValue({
        id: 'spp1',
        isVerified: true,
        verifiedAt: new Date(),
      } as any);

      const result = await service.verify('spp1');
      const updateArg = (prisma.serviceProviderProfile.update as jest.Mock).mock.calls[0][0];
      expect(updateArg.data.isVerified).toBe(true);
      expect(updateArg.data.verifiedAt).toBeInstanceOf(Date);
      expect(result.isVerified).toBe(true);
    });

    it('throws NotFound for an unknown provider', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue(null);
      await expect(service.verify('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('list', () => {
    it('applies the isVerified filter', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as any);
      await service.list({ isVerified: true, page: 1, limit: 10 });
      const findArg = (prisma.serviceProviderProfile.findMany as jest.Mock).mock.calls[0][0];
      expect(findArg.where).toMatchObject({ isVerified: true });
    });
  });

  describe('publicServices', () => {
    it('throws NotFound for an unknown provider', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue(null);
      await expect(service.publicServices('nope', {})).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lists only ACTIVE, non-deleted services for the provider', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue({ id: 'spp1' } as any);
      prisma.$transaction.mockResolvedValue([[], 0] as any);
      await service.publicServices('spp1', { page: 1, limit: 10 });
      const findArg = (prisma.service.findMany as jest.Mock).mock.calls[0][0];
      expect(findArg.where).toMatchObject({ providerId: 'spp1', status: 'ACTIVE', deletedAt: null });
    });
  });
});
