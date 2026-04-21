import { Lugar } from "./lugar.model";
import * as L from 'leaflet';

export interface Evento {
_id: string;
  nome: string;
  fecha?: string;
coords: { lat: number; lng: number };  tipo: string;
  prezo?: number;
  descripcion: string;
  bailes?: string[];
  cancions?: string[];
  eventos?: string[];
  publicado: boolean;
  Lugar?: Lugar;
  enlaceExterno?: string;
}
