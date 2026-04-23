import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  UnauthorizedException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Rol } from '../common/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos del decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si el endpoint no tiene el decorador @Roles, se permite el acceso
    if (!requiredRoles) {
      return true; 
    }

    // Obtenemos el usuario de la petición (inyectado por JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificamos si el usuario existe (por si acaso el guard de JWT falló)
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado en la petición');
    }

    // Si el usuario tiene el rol de SUPERUSER, tiene acceso total siempre.
    // Esto evita tener que poner Rol.SUPERUSER en todos los controladores.
    if (user.rol === Rol.SUPERUSER) {
      return true;
    }
    // --------------------------------

    //  Comprobamos si el rol del usuario está dentro de los permitidos
    const tienePermiso = requiredRoles.includes(user.rol);

    if (!tienePermiso) {
      throw new ForbiddenException(
        `Tu rol (${user.rol}) no tiene permisos suficientes para realizar esta acción`
      );
    }

    return true;
  }
}