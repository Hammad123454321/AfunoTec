import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  @Post('chat')
  @Public()
  @ApiOperation({
    summary: 'AI chat — placeholder. Implemented after client provides AI specs/credentials.',
  })
  chat(): never {
    throw new HttpException(
      {
        message: 'AI module not yet implemented; awaiting client specifications.',
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}
