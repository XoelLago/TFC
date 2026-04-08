import { Rol } from './rol.model';

export interface Usuario {
_id: string;
  nome: string;
  contrasena: string;
  rol: Rol;                  // 'USER' | 'ADMIN'
  favoritos?: string[];      // opcional: IDs de bailes, canciones, etc.
}
