import { Lugar } from './lugar.model';
import { movemento } from './movemento.model';

export interface Punto {
_id: string;
  descripcion?: string;
  tipo?: string;
  videoUrl?: string;
  lugar?: Lugar;
  movementos?: movemento[];
}
