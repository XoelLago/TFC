import { Injectable } from '@angular/core';
import { MAP_DATA, DatosMapa } from './datos.data';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  private data: DatosMapa[] = MAP_DATA;

  constructor() {}

  // Simula una llamada a base de datos
  buscarLugares(termino: string): Observable<DatosMapa[]> {
    if (!termino.trim()) return of([]);

    const resultado = this.data.filter(place =>
      place.nome.toLowerCase().includes(termino.toLowerCase()) ||
      place.tipo.toLowerCase().includes(termino.toLowerCase())
    );

    return of(resultado);
  }

  getTodos(): DatosMapa[] {
    return this.data;
  }
}
