import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: string } | undefined;
    if (!user?.role) throw new ForbiddenException('Missing role on user');
    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException(
        `Required role(s): ${requiredRoles.join(', ')}. You have: ${user.role}.`,
      );
    }
    return true;
  }
}
