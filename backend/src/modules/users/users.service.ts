import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UserRole } from '../../common/enums';
import { TokenService } from '../auth/token.service';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { escapeRegExp } from '../../common/utils/regex.util';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/** Mongoose projection of fields safe to return to clients — never the password hash. */
const PUBLIC_USER_PROJECTION = {
  email: 1,
  emailVerifiedAt: 1,
  phone: 1,
  phoneVerifiedAt: 1,
  name: 1,
  country: 1,
  profileUrl: 1,
  role: 1,
  isActive: 1,
  isTwoFactorEnabled: 1,
  preferredLocale: 1,
  preferredCurrency: 1,
  lastLoginAt: 1,
  createdAt: 1,
  updatedAt: 1,
} as const;

const SORTABLE = ['createdAt', 'name', 'email', 'role'] as const;

export interface PublicUserView {
  id: string;
  email: string;
  emailVerifiedAt?: Date | null;
  phone?: string | null;
  phoneVerifiedAt?: Date | null;
  name: string;
  country?: string | null;
  profileUrl?: string | null;
  role: UserRole;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  preferredLocale: string;
  preferredCurrency: string;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokens: TokenService,
  ) {}

  /** Projects a lean user doc into the public view (string id, no password hash). */
  private toView(doc: Record<string, unknown> & { _id: { toString(): string } }): PublicUserView {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...(rest as Omit<PublicUserView, 'id'>) };
  }

  /** Paginated listing with role / isActive / free-text filters. Excludes soft-deleted users. */
  async list(query: QueryUsersDto): Promise<Paginated<PublicUserView>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);

    const where: FilterQuery<UserDocument> = { deletedAt: null };
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.query) {
      const rx = new RegExp(escapeRegExp(query.query), 'i');
      where.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const sort = parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' as const };

    const [rows, total] = await Promise.all([
      this.userModel.find(where).select(PUBLIC_USER_PROJECTION).sort(sort).skip(skip).limit(take).lean().exec(),
      this.userModel.countDocuments(where).exec(),
    ]);

    return { data: rows.map((r) => this.toView(r)), meta: buildPaginationMeta(total, page, limit) };
  }

  /** Fetches a single non-deleted user. */
  async getById(id: string): Promise<PublicUserView> {
    const user = await this.userModel
      .findOne({ _id: id, deletedAt: null })
      .select(PUBLIC_USER_PROJECTION)
      .lean()
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return this.toView(user);
  }

  /** Updates the caller's own profile. */
  async updateMe(userId: string, dto: UpdateMeDto): Promise<PublicUserView> {
    await this.ensureExists(userId);
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.phone !== undefined) patch.phone = dto.phone.trim() || null;
    if (dto.profileUrl !== undefined) patch.profileUrl = dto.profileUrl || null;
    if (dto.preferredLocale !== undefined) patch.preferredLocale = dto.preferredLocale;
    if (dto.preferredCurrency !== undefined) patch.preferredCurrency = dto.preferredCurrency;
    return this.applyUpdate(userId, patch);
  }

  /** Admin update of an arbitrary user's profile fields. */
  async updateByAdmin(id: string, dto: UpdateUserDto): Promise<PublicUserView> {
    await this.ensureExists(id);
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.phone !== undefined) patch.phone = dto.phone.trim() || null;
    if (dto.country !== undefined) patch.country = dto.country || null;
    if (dto.profileUrl !== undefined) patch.profileUrl = dto.profileUrl || null;
    if (dto.preferredLocale !== undefined) patch.preferredLocale = dto.preferredLocale;
    if (dto.preferredCurrency !== undefined) patch.preferredCurrency = dto.preferredCurrency;
    return this.applyUpdate(id, patch);
  }

  /** Reassigns a user's role (admin only). */
  async assignRole(id: string, role: UserRole): Promise<PublicUserView> {
    await this.ensureExists(id);
    return this.applyUpdate(id, { role });
  }

  /** Activates/deactivates a user. Deactivation revokes their sessions. */
  async setStatus(id: string, isActive: boolean): Promise<PublicUserView> {
    await this.ensureExists(id);
    const updated = await this.applyUpdate(id, { isActive });
    if (!isActive) await this.tokens.revokeAllForUser(id);
    return updated;
  }

  /** Soft-deletes a user, deactivates the account, and revokes all sessions. */
  async softDelete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.userModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), isActive: false } },
    );
    await this.tokens.revokeAllForUser(id);
  }

  /** Applies a patch and returns the refreshed public view. */
  private async applyUpdate(id: string, patch: Record<string, unknown>): Promise<PublicUserView> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .select(PUBLIC_USER_PROJECTION)
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return this.toView(updated);
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.userModel
      .findOne({ _id: id, deletedAt: null })
      .select({ _id: 1 })
      .lean()
      .exec();
    if (!found) throw new NotFoundException('User not found');
  }
}
