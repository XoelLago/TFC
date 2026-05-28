import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asociacion } from '../models/asociacion.model';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  // Cambia esto por la URL real de tu API de Spring Boot / Backend
  private apiUrl = 'http://localhost:3000/asociaciones';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el listado completo de asociaciones.
   * Utilizado en el buscador del formulario de eventos.
   */
  public findAll(): Observable<Asociacion[]> {
    return this.http.get<Asociacion[]>(this.apiUrl);
  }

  /**
   * Busca una asociación concreta por su ID.
   */
  public findById(id: number): Observable<Asociacion> {
    return this.http.get<Asociacion>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva asociación.
   */
  public create(asociacion: Asociacion): Observable<Asociacion> {
    return this.http.post<Asociacion>(this.apiUrl, asociacion);
  }

  /**
   * Actualiza los datos de una asociación existente.
   */
  public update(id: number, asociacion: Asociacion): Observable<Asociacion> {
    return this.http.put<Asociacion>(`${this.apiUrl}/${id}`, asociacion);
  }

  /**
   * Elimina una asociación por su ID.
   */
  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
