import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateMarcadorForm, DatosMapa } from '../models/mapa.model';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }

  // Obtenemos todo en una sola carga
 // src/app/service/mapa.service.ts
getTodoElMapa(): Observable<DatosMapa[]> {
  return forkJoin({
    lugares: this.http.get<DatosMapa[]>(`${this.apiUrl}/lugares`),
    asociaciones: this.http.get<DatosMapa[]>(`${this.apiUrl}/asociaciones`),
    eventos: this.http.get<DatosMapa[]>(`${this.apiUrl}/eventos`),
    personalizados: this.http.get<DatosMapa[]>(`${this.apiUrl}/marcadores`)
  }).pipe(
    map(resp => [
      ...resp.lugares,
      ...resp.asociaciones,
      ...resp.eventos,
      ...resp.personalizados
    ])
  );
}

  guardarMarcador(dto: CreateMarcadorForm): Observable<DatosMapa> {
    return this.http.post<DatosMapa>(`${this.apiUrl}/marcadores`, dto, { headers: this.getHeaders() });
  }

  // Actualizar un marcador existente (PUT o PATCH)
  actualizarMarcador(id: number | string, marcador: any): Observable<DatosMapa> {
    return this.http.put<DatosMapa>(`${this.apiUrl}/marcadores/${id}`, marcador);
  }

  // Borrar un marcador (DELETE)
  borrarMarcador(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/marcadores/${id}`);
  }
}
