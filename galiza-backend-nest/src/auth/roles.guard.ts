import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Rol } from '../common/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si la ruta no tiene @Roles, es pública para cualquier logueado
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Comprobamos si el rol del usuario está entre los permitidos
    const tienePermiso = requiredRoles.some((rol) => user.rol?.includes(rol));

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permisos de Administrador para hacer esto');
    }

    return tienePermiso;
  }
}