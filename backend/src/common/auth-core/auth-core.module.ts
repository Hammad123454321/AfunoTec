import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { JwtStrategy } from '../strategies/jwt.strategy';

/**
 * Registers Passport + the JWT access-token strategy and exposes a configured
 * `JwtModule` for signing/verifying tokens. Global so every feature module can
 * rely on the `'jwt'` strategy (used by the global `JwtAuthGuard`), and so the
 * Auth module can inject `JwtService` without re-registering it.
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret') ?? 'dev-access-secret',
        signOptions: { expiresIn: config.get<number>('jwt.accessTtl') ?? 900 },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule, MongooseModule],
})
export class AuthCoreModule {}
