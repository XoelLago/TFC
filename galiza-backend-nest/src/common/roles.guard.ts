import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Rol } from './enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ¿Qué roles requiere esta ruta?
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene el decorador @Roles, permitimos el paso
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtenemos el usuario del request (inyectado previamente por el AuthGuard/JWT)
    const { user } = context.switchToHttp().getRequest();

    // 3. Comprobamos si el rol del usuario coincide con alguno de los permitidos
    return requiredRoles.some((rol) => user.rol?.includes(rol));
  }
}