import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class movementosService {
  private readonly URL_movementoS = environment.apiUrl + '/movementos';

  constructor(private http: HttpClient) {}



  crearmovemento(movemento: any): Observable<any> {
    return this.http.post(this.URL_movementoS, movemento);
  }

  findAll(): Observable<any> {
    return this.http.get(this.URL_movementoS);
  }

  obtenermovementoPorId(id: number): Observable<any> {
    return this.http.get(`${this.URL_movementoS}/${id}`);
  }

  actualizarmovemento(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.URL_movementoS}/${id}`, data);
  }

  eliminarmovemento(id: number): Observable<any> {
    return this.http.delete(`${this.URL_movementoS}/${id}`);
  }
}
