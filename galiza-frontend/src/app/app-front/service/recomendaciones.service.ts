import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private readonly URL_RECOMENDACIONES = environment.apiUrl + '/recomendaciones';

  constructor(private http: HttpClient) {}



  crearRecomendacion(recomendacion: any): Observable<any> {
    return this.http.post(this.URL_RECOMENDACIONES, recomendacion);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_RECOMENDACIONES);
  }

  obtenerRecomendacionPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_RECOMENDACIONES}/${id}`);
  }

  actualizarRecomendacion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_RECOMENDACIONES}/${id}`, data);
  }

  eliminarRecomendacion(id: number): Observable<any> {
    return this.http.delete(`${this.URL_RECOMENDACIONES}/${id}`);
  }
}
