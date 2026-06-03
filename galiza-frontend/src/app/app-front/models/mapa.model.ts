export interface Coords {
  lat: number;
  lng: number;
}

export interface DatosMapa {
  id: number;
  nome: string;
  coords: Coords;
  tipo: 'asociacion' | 'evento' | 'lugar' | 'personalizado';
  icono: string;
  descripcion?: string;


  bailes?: string[];
  cancions?: string[];
}

export interface CreateMarcadorForm {
  nome: string;
  descripcion?: string;
  tipo?: string;
  icono?: string;
  coords: Coords;
}
