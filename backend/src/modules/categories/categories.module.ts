import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/**
 * Service catalog categories: cached public listing + slug lookup, and
 * audited admin CRUD. Deletion is refused while active services reference the
 * category. CacheModule and PrismaModule are global.
 */
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
