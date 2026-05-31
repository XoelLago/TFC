import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PuntosService {
  private readonly URL_PUNTOS = environment.apiUrl + '/puntos';

  constructor(private http: HttpClient) {}


  crearPunto(punto: any): Observable<any> {
    return this.http.post(this.URL_PUNTOS, punto);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_PUNTOS);
  }

  obtenerPuntoPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_PUNTOS}/${id}`);
  }

  actualizarPunto(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_PUNTOS}/${id}`, data);
  }

  eliminarPunto(id: number): Observable<any> {
    return this.http.delete(`${this.URL_PUNTOS}/${id}`);
  }
}
