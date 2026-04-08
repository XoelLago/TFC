import { Instrumento } from "./instrumento.model";
import { Lugar } from "./lugar.model";

export interface Cancion {
_id: string;
  nome: string;
  letra?: string;
  audioUrl?: string;
  instrumentos?: Instrumento[];
  lugares?: Lugar[];
}
