import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private readonly URL_EVENTOS = environment.apiUrl + '/eventos';
  private readonly URL_SOLICITUDES = environment.apiUrl + '/solicitudes-evento';

  constructor(private http: HttpClient) {}

 crearEvento(evento: any): Observable<any> {
    return this.http.post(this.URL_EVENTOS, evento);
  }
  findAll(): Observable<any>{
    return this.http.get(this.URL_EVENTOS)
    }

  actualizarEvento(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_EVENTOS}/${id}`, data);
  }

  obtenerEventoPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_EVENTOS}/${id}`);
  }

  crearSolicitud(solicitud: any): Observable<any> {
    return this.http.post(this.URL_SOLICITUDES, solicitud);
  }

  obtenerSolicitudes(): Observable<any> {
    return this.http.get(this.URL_SOLICITUDES);
  }

  actualizarSolicitud(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_SOLICITUDES}/${id}`, data);
  }

  eliminarSolicitud(id: number): Observable<any>{
    return this.http.delete(`${this.URL_SOLICITUDES}/${id}`)
  }

  eliminarEvento(id: number): Observable<any>{
    return this.http.delete(`${this.URL_EVENTOS}/${id}`)
  }
}
