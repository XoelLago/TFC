import { SetMetadata } from '@nestjs/common';
import { Rol } from './enums';

// La clave 'roles' es la que usaremos después en el Guard
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);