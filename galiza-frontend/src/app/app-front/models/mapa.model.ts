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

  bailes?: string[];   // El '?' significa que es opcional
  cancions?: string[];
}

// Para el formulario de creación
export interface CreateMarcadorForm {
  nome: string;
  descripcion?: string;
  tipo?: string;
  icono?: string;
  coords: Coords;
}
