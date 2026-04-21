// src/app/models/baile.model.ts

import { Instrumento } from "./instrumento.model";
import { Lugar } from "./lugar.model";
import { Provincia } from "./provincia.model";


export interface Baile {
_id: string;
  nome: string;
  descripcion?: string;
  compas?: string;
  imaxeUrl?: string;
  videoUrl?: string;
  lugar: Lugar;
  instrumentos?: Instrumento[];
}
