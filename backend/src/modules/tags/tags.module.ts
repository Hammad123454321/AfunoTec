import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from '../../database/schemas/tag.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

/**
 * Filter tags: cached public listing + slug lookup, and audited admin CRUD.
 * Deletion cascades the service_tags join rows. Global Cache/Prisma modules.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
