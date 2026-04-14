import { Rol } from "./rol.model";

export interface Usuario {
  id: number;
  nombre: string;
  rol: Rol;
  marcadores?: any[]; // Puedes tipar Marcador luego si quieres
}

// Interfaz para que el componente AdminUsers sea reutilizable
export interface UsuarioMapeado {
  id: number;
  titulo: string;
  etiqueta: string;
  claseCss: string;
  original: Usuario;
}
