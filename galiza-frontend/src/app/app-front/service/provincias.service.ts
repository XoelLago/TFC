import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private readonly URL_PROVINCIAS = environment.apiUrl + '/provincias';

  constructor(private http: HttpClient) {}



  crearProvincia(provincia: any): Observable<any> {
    return this.http.post(this.URL_PROVINCIAS, provincia);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.URL_PROVINCIAS);
  }

  obtenerProvinciaPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_PROVINCIAS}/${id}`);
  }

  actualizarProvincia(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_PROVINCIAS}/${id}`, data);
  }

  eliminarProvincia(id: number): Observable<any> {
    return this.http.delete(`${this.URL_PROVINCIAS}/${id}`);
  }
}
