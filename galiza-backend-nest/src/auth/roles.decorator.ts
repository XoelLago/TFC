import { SetMetadata } from '@nestjs/common';
import { Rol } from '../common/enums'; // Asegúrate de tener tu Enum de Roles

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);