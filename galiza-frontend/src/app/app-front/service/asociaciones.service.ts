import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asociacion } from '../models/asociacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  private readonly API_URL = environment.apiUrl + '/asociaciones';

  constructor(private http: HttpClient) { }


  public findAll(): Observable<Asociacion[]> {
    return this.http.get<Asociacion[]>(this.API_URL);
  }


  public findById(id: number): Observable<Asociacion> {
    return this.http.get<Asociacion>(`${this.API_URL}/${id}`);
  }


  public create(asociacion: Asociacion): Observable<Asociacion> {
    return this.http.post<Asociacion>(this.API_URL, asociacion);
  }


  public update(id: number, asociacion: Asociacion): Observable<Asociacion> {
    return this.http.put<Asociacion>(`${this.API_URL}/${id}`, asociacion);
  }


  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
