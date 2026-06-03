
import { Instrumento } from "./instrumento.model";
import { Lugar } from "./lugar.model";


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
