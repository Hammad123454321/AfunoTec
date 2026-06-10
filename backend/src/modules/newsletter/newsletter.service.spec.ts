import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NewsletterService } from './newsletter.service';

describe('NewsletterService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: NewsletterService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new NewsletterService(prisma);
  });

  describe('subscribe', () => {
    it('upserts (re-activating) by lower-cased email', async () => {
      prisma.newsletterSubscriber.upsert.mockResolvedValue({} as any);
      const res = await service.subscribe({ email: 'Reader@Example.com', locale: 'fr' });
      expect(res).toEqual({ subscribed: true });
      const arg = (prisma.newsletterSubscriber.upsert as jest.Mock).mock.calls[0][0];
      expect(arg.where.email).toBe('reader@example.com');
      expect(arg.update.isActive).toBe(true);
    });
  });

  describe('list', () => {
    it('applies the isActive and search filters', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as any);
      await service.list({ isActive: true, query: 'reader', page: 1, limit: 10 });
      const arg = (prisma.newsletterSubscriber.findMany as jest.Mock).mock.calls[0][0];
      expect(arg.where.isActive).toBe(true);
      expect(arg.where.email).toEqual({ contains: 'reader', mode: 'insensitive' });
    });
  });

  describe('remove', () => {
    it('throws NotFound for a missing subscriber', async () => {
      prisma.newsletterSubscriber.findUnique.mockResolvedValue(null);
      await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deletes an existing subscriber', async () => {
      prisma.newsletterSubscriber.findUnique.mockResolvedValue({ id: 's1' } as any);
      prisma.newsletterSubscriber.delete.mockResolvedValue({} as any);
      await service.remove('s1');
      expect(prisma.newsletterSubscriber.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    });
  });
});
