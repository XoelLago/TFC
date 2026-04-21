import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lugar } from '../models/lugar.model'; // Asegúrate de tener la interfaz creada
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  // Ajusta la URL según tu configuración de entorno
  private readonly API_URL = environment.apiUrl + '/lugares';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los lugares
   */
  getLugares(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(this.API_URL);
  }

  /**
   * Obtener un lugar por ID
   */
  getLugar(id: number): Observable<Lugar> {
    return this.http.get<Lugar>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear un nuevo lugar
   * El back espera el DTO con la estructura que definiste
   */
  crearLugar(lugar: any): Observable<Lugar> {
    return this.http.post<Lugar>(`${this.API_URL}/`, lugar);
  }

  /**
   * Actualizar un lugar existente
   */
  actualizarLugar(id: number, lugar: any): Observable<Lugar> {
    return this.http.patch<Lugar>(`${this.API_URL}/${id}`, lugar);
  }

  /**
   * Eliminar un lugar
   */
  borrarLugar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
