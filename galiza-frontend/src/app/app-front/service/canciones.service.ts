import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private readonly URL_CANCIONES = environment.apiUrl + '/canciones';

  constructor(private http: HttpClient) {}



  crearCancion(cancion: any): Observable<any> {
    return this.http.post(this.URL_CANCIONES, cancion);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_CANCIONES);
  }

  obtenerCancionPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_CANCIONES}/${id}`);
  }

  actualizarCancion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_CANCIONES}/${id}`, data);
  }

  eliminarCancion(id: number): Observable<any> {
    return this.http.delete(`${this.URL_CANCIONES}/${id}`);
  }
}
