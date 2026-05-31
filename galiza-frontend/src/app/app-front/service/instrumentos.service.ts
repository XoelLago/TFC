import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstrumentosService {
  private readonly URL_INSTRUMENTOS = environment.apiUrl + '/instrumentos';

  constructor(private http: HttpClient) {}


  crearInstrumento(instrumento: any): Observable<any> {
    return this.http.post(this.URL_INSTRUMENTOS, instrumento);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_INSTRUMENTOS);
  }

  obtenerInstrumentoPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_INSTRUMENTOS}/${id}`);
  }

  actualizarInstrumento(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_INSTRUMENTOS}/${id}`, data);
  }

  eliminarInstrumento(id: number): Observable<any> {
    return this.http.delete(`${this.URL_INSTRUMENTOS}/${id}`);
  }
}
