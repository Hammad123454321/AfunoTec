import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

/**
 * Filter tags: cached public listing + slug lookup, and audited admin CRUD.
 * Deletion cascades the service_tags join rows. Global Cache/Prisma modules.
 */
@Module({
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
