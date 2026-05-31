import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private readonly URL_MOVIMIENTOS = environment.apiUrl + '/movimientos';

  constructor(private http: HttpClient) {}



  crearMovimiento(movimiento: any): Observable<any> {
    return this.http.post(this.URL_MOVIMIENTOS, movimiento);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_MOVIMIENTOS);
  }

  obtenerMovimientoPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_MOVIMIENTOS}/${id}`);
  }

  actualizarMovimiento(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_MOVIMIENTOS}/${id}`, data);
  }

  eliminarMovimiento(id: number): Observable<any> {
    return this.http.delete(`${this.URL_MOVIMIENTOS}/${id}`);
  }
}
