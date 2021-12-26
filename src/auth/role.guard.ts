import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum, User } from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(role, user);
  }
}

function matchRoles(role: string, user: User): boolean {
  if (user.role === RoleEnum.Admin || role === user.role) {
    return true;
  }
  throw new ForbiddenException("ACCESS_DENIED");
}
