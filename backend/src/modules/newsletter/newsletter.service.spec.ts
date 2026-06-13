import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { NewsletterSubscriberDocument } from '../../database/schemas/newsletter-subscriber.schema';
import { NewsletterService } from './newsletter.service';

/** Chainable query stub resolving to `value` at exec(). */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate'])
    chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('NewsletterService', () => {
  let subscriberModel: DeepMockProxy<Model<NewsletterSubscriberDocument>>;
  let service: NewsletterService;

  beforeEach(() => {
    subscriberModel = mockDeep<Model<NewsletterSubscriberDocument>>();
    service = new NewsletterService(subscriberModel);
  });

  describe('subscribe', () => {
    it('upserts (re-activating) by lower-cased email', async () => {
      subscriberModel.findOneAndUpdate.mockReturnValue(queryChain({}) as never);
      const res = await service.subscribe({ email: 'Reader@Example.com', locale: 'fr' });
      expect(res).toEqual({ subscribed: true });
      const [filter, update] = (subscriberModel.findOneAndUpdate as jest.Mock).mock
        .calls[0] as unknown as [{ email: string }, { $set: { isActive: boolean } }];
      expect(filter.email).toBe('reader@example.com');
      expect(update.$set.isActive).toBe(true);
    });
  });

  describe('list', () => {
    it('applies the isActive and search filters', async () => {
      subscriberModel.find.mockReturnValue(queryChain([]) as never);
      subscriberModel.countDocuments.mockReturnValue(queryChain(0) as never);
      await service.list({ isActive: true, query: 'reader', page: 1, limit: 10 });
      const filter = (subscriberModel.find as jest.Mock).mock.calls[0]?.[0] as {
        isActive: boolean;
        email: RegExp;
      };
      expect(filter.isActive).toBe(true);
      expect(filter.email).toBeInstanceOf(RegExp);
      expect(filter.email.source).toBe('reader');
      expect(filter.email.flags).toContain('i');
    });
  });

  describe('remove', () => {
    it('throws NotFound for a missing subscriber', async () => {
      subscriberModel.exists.mockResolvedValue(null);
      await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deletes an existing subscriber', async () => {
      subscriberModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      subscriberModel.deleteOne.mockResolvedValue({} as never);
      await service.remove('s1');
      expect(subscriberModel.deleteOne).toHaveBeenCalledWith({ _id: 's1' });
    });
  });
});
