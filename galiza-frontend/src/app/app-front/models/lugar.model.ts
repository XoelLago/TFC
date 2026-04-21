import { Baile } from "./baile.model";
import { Cancion } from "./cancion.model";
import { Evento } from "./evento.model";
import { Provincia } from "./provincia.model";
import * as L from 'leaflet';

export interface Lugar {
_id: string;
  nome: string;
coords: { lat: number; lng: number };
 tipo: 'lugar';
  icono: string;
  descripcion: string;
  bailes?: Baile[];
  cancions?: Cancion[];
  eventos?: Evento[];
  provincia?: Provincia;
}
