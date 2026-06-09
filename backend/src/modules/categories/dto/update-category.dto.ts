import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/** All create fields become optional for PATCH. */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
