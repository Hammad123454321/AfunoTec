import { OmitType, PartialType } from '@nestjs/swagger';
import { AddCartItemDto } from './add-cart-item.dto';

/** Update an existing cart line; the service cannot be changed (remove + re-add instead). */
export class UpdateCartItemDto extends PartialType(OmitType(AddCartItemDto, ['serviceId'] as const)) {}
