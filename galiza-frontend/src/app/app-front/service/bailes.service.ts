import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaileService {
  private readonly URL_BAILES = environment.apiUrl + '/bailes';

  constructor(private http: HttpClient) {}



  crearBaile(baile: any): Observable<any> {
    return this.http.post(this.URL_BAILES, baile);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_BAILES);
  }

  obtenerBailePorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_BAILES}/${id}`);
  }

  actualizarBaile(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_BAILES}/${id}`, data);
  }

  eliminarBaile(id: number): Observable<any> {
    return this.http.delete(`${this.URL_BAILES}/${id}`);
  }
}
