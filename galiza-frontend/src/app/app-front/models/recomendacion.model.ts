import { TipoRecomendacion } from "./tipoRecomendacion.model";

export interface Recomendacion {
id: number;
  titulo: string;
  autor: string;
  tipo: TipoRecomendacion;
  enlaceExterno: string;
  resumo: string;
  imagenUrl?: string;
  etiquetas?: string[];
}
