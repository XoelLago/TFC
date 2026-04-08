import { Rol } from './rol.model';

export interface Usuario {
_id: string;
  email: string;
  nome: string;
  rol: Rol;                  // 'USER' | 'ADMIN'
  favoritos?: string[];      // opcional: IDs de bailes, canciones, etc.
}
