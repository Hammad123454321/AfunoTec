import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

/**
 * Update accepts the same scalar fields (all optional). Nested collections
 * (images/rooms/addOns/discounts) are managed via their own endpoints or a
 * dedicated replace flag, so they are omitted here to keep PATCH predictable.
 */
export class UpdateServiceDto extends PartialType(
  OmitType(CreateServiceDto, [
    'images',
    'detailPoints',
    'packageSummary',
    'packageConditions',
    'whyStayHere',
    'addOns',
    'rooms',
    'discounts',
  ] as const),
) {}
