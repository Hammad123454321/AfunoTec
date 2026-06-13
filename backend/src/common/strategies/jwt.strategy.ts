import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { AuthUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type?: 'access';
}

/** Pulls the access token from the `accessToken` cookie when no Bearer header is present. */
function cookieExtractor(req: Request): string | null {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  return cookies?.accessToken ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret') ?? 'dev-access-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.userModel
      .findById(payload.sub)
      .select({ email: 1, role: 1, isActive: 1, deletedAt: 1 })
      .lean()
      .exec();

    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Account is inactive or no longer exists');
    }

    return { id: user._id.toString(), email: user.email, role: user.role };
  }
}
