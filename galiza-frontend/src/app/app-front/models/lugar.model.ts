import { Provincia } from "./provincia.model";
import * as L from 'leaflet';

export interface Lugar {
_id: string;
  nome: string;
coords: { lat: number; lng: number };  tipo: 'lugar';
  icono: string;
  descripcion: string;
  bailes?: string[];
  cancions?: string[];
  eventos?: string[];
  provincia?: Provincia;
}
