import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { SetStatusDto } from './dto/set-status.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List users (paginated, filterable by role/isActive/query)' })
  list(@Query() query: QueryUsersDto) {
    return this.users.list(query);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user’s own profile' })
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto) {
    return this.users.updateMe(user.id, dto);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @ApiOperation({ summary: 'Get a single user by id' })
  getById(@Param('id') id: string) {
    return this.users.getById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @Audit({ action: 'UPDATE', entity: 'User' })
  @ApiOperation({ summary: 'Update any user (admin)' })
  updateByAdmin(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.updateByAdmin(id, dto);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  @Audit({ action: 'ROLE_CHANGE', entity: 'User' })
  @ApiOperation({ summary: 'Reassign a user’s role (admin)' })
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.users.assignRole(id, dto.role);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'STATUS_CHANGE', entity: 'User' })
  @ApiOperation({ summary: 'Activate or deactivate a user' })
  setStatus(@Param('id') id: string, @Body() dto: SetStatusDto) {
    return this.users.setStatus(id, dto.isActive);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Audit({ action: 'DELETE', entity: 'User' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a user (admin)' })
  async remove(@Param('id') id: string) {
    await this.users.softDelete(id);
    return { message: 'User deleted' };
  }
}
