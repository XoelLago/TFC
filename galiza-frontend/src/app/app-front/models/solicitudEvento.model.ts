import { EstadoSolicitud } from "./estadoSoli.model";
import { Lugar } from "./lugar.model";
import { Usuario } from "./usuario.model";

export interface SolicitudEvento {
_id: string;
  nome?: string;
  descripcion?: string;
  fecha?: string;            // ISO 8601
  tipo?: string;             // curso, foliada, festival...
  gratuito?: boolean;
  prezo?: number;
  enlaceExterno?: string;
  lugar?: Lugar;
  estado?: EstadoSolicitud;  // 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'
  usuario?: Usuario;
}
