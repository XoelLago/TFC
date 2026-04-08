import { TipoRecomendacion } from "./tipoRecomendacion.model";

export interface Recomendacion {
_id: string;
  titulo: string;
  autor?: string;           // artista, escritor, grupo...
  descripcion?: string;
  tipo?: TipoRecomendacion;
  imaxeUrl?: string;
  enlaceExterno?: string;
}
