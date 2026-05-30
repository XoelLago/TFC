import { TipoRecomendacion } from "./tipoRecomendacion.model";

export interface Recomendacion {
id: number;
  titulo: string;
  autor: string;
  tipo: TipoRecomendacion;
  enlaceExterno: string;
  resumo: string;
  // Campos extra solo para la UI hardcodeada
  imagenUrl?: string;
  etiquetas?: string[];
}
