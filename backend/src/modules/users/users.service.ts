import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TokenService } from '../auth/token.service';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/** Columns safe to return to clients — never the password hash. */
const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  emailVerifiedAt: true,
  phone: true,
  phoneVerifiedAt: true,
  name: true,
  country: true,
  profileUrl: true,
  role: true,
  isActive: true,
  isTwoFactorEnabled: true,
  preferredLocale: true,
  preferredCurrency: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const SORTABLE = ['createdAt', 'name', 'email', 'role'] as const;

export type PublicUserView = Prisma.UserGetPayload<{ select: typeof PUBLIC_USER_SELECT }>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
  ) {}

  /** Paginated listing with role / isActive / free-text filters. Excludes soft-deleted users. */
  async list(query: QueryUsersDto): Promise<Paginated<PublicUserView>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);

    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.query) {
      where.OR = [
        { name: { contains: query.query, mode: 'insensitive' } },
        { email: { contains: query.query, mode: 'insensitive' } },
        { phone: { contains: query.query, mode: 'insensitive' } },
      ];
    }

    const orderBy = parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' as const };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, select: PUBLIC_USER_SELECT, orderBy, skip, take }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Fetches a single non-deleted user. */
  async getById(id: string): Promise<PublicUserView> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Updates the caller's own profile. */
  async updateMe(userId: string, dto: UpdateMeDto): Promise<PublicUserView> {
    await this.ensureExists(userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone.trim() || null }),
        ...(dto.profileUrl !== undefined && { profileUrl: dto.profileUrl || null }),
        ...(dto.preferredLocale !== undefined && { preferredLocale: dto.preferredLocale }),
        ...(dto.preferredCurrency !== undefined && { preferredCurrency: dto.preferredCurrency }),
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Admin update of an arbitrary user's profile fields. */
  async updateByAdmin(id: string, dto: UpdateUserDto): Promise<PublicUserView> {
    await this.ensureExists(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone.trim() || null }),
        ...(dto.country !== undefined && { country: dto.country || null }),
        ...(dto.profileUrl !== undefined && { profileUrl: dto.profileUrl || null }),
        ...(dto.preferredLocale !== undefined && { preferredLocale: dto.preferredLocale }),
        ...(dto.preferredCurrency !== undefined && { preferredCurrency: dto.preferredCurrency }),
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Reassigns a user's role (admin only). */
  async assignRole(id: string, role: Prisma.UserUpdateInput['role']): Promise<PublicUserView> {
    await this.ensureExists(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Activates/deactivates a user. Deactivation revokes their sessions. */
  async setStatus(id: string, isActive: boolean): Promise<PublicUserView> {
    await this.ensureExists(id);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: PUBLIC_USER_SELECT,
    });
    if (!isActive) await this.tokens.revokeAllForUser(id);
    return updated;
  }

  /** Soft-deletes a user, deactivates the account, and revokes all sessions. */
  async softDelete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    await this.tokens.revokeAllForUser(id);
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!found) throw new NotFoundException('User not found');
  }
}
