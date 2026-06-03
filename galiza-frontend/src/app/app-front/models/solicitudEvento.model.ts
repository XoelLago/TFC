import { EstadoSolicitud } from "./estadoSoli.model";
import { Lugar } from "./lugar.model";
import { Usuario } from "./usuario.model";

export interface SolicitudEvento {
_id: string;
  nome?: string;
  descripcion?: string;
  fecha?: string;
  tipo?: string;
  gratuito?: boolean;
  prezo?: number;
  enlaceExterno?: string;
  lugar?: Lugar;
  estado?: EstadoSolicitud;
  usuario?: Usuario;
}
