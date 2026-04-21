import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private readonly API_URL = environment.apiUrl + '/eventos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  findOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  create(evento: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/`, evento);
  }

  update(id: number, evento: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}`, evento);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
