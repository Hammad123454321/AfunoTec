import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../database/schemas/category.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/**
 * Service catalog categories: cached public listing + slug lookup, and
 * audited admin CRUD. Deletion is refused while active services reference the
 * category. CacheModule and PrismaModule are global.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
