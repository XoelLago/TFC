import { Lugar } from "./lugar.model";
import { Provincia } from "./provincia.model";
import * as L from 'leaflet';

export interface Asociacion {
  _id: string;
  nome: string;
  coords: { lat: number; lng: number };  tipo: 'asociacion';
  icono: string;
  descripcion: string;
  bailes?: string[];
  cancions?: string[];
  eventos?: string[];
  Lugar?: Lugar;
  enlaceExterno?: string;
}
