import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private readonly URL_cancions = environment.apiUrl + '/cancions';

  constructor(private http: HttpClient) {}



  crearCancion(cancion: any): Observable<any> {
    return this.http.post(this.URL_cancions, cancion);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_cancions);
  }

  obtenerCancionPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_cancions}/${id}`);
  }

  actualizarCancion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_cancions}/${id}`, data);
  }

  eliminarCancion(id: number): Observable<any> {
    return this.http.delete(`${this.URL_cancions}/${id}`);
  }
}
