import { Lugar } from "./lugar.model";
import * as L from 'leaflet';

export interface Evento {
_id: string;
  nome: string;
  fecha?: string;
coords: { lat: number; lng: number };  tipo: string;
  prezo?: number;
  icono: string;
  descripcion: string;
  bailes?: string[];
  cancions?: string[];
  eventos?: string[];
  Lugar?: Lugar;
  enlaceExterno?: string;
}
