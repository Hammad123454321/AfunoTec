import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type Role =
  | 'ADMIN'
  | 'MANAGER'
  | 'AGENT'
  | 'INFLUENCER'
  | 'SERVICE_PROVIDER'
  | 'CUSTOMER';

export const Roles = (...roles: Role[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
