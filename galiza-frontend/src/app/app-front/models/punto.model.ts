import { Lugar } from './lugar.model';
import { movemento } from './movemento.model';

export interface Punto {
_id: string;
  descripcion?: string;
  tipo?: string;          // giro, salto, desplazamiento...
  videoUrl?: string;
  lugar?: Lugar;
  movementos?: movemento[];
}
