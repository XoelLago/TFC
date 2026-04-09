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
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();
    
    // CAMBIO CLAVE: En MySQL el rol es un valor único (string/enum), 
    // así que verificamos si ese valor está incluido en la lista de roles permitidos.
    const tienePermiso = requiredRoles.includes(user.rol);

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permisos suficientes para realizar esta acción');
    }

    return tienePermiso;
  }
}