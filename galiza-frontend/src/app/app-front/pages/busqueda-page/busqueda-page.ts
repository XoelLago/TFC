import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DetallesGeneral } from '../../components/detalles-general/detalles-general';

import { AsociacionesService } from '../../service/asociaciones.service';
import { PuntosService } from '../../service/puntos.service';
import { LugaresService } from '../../service/lugares.service';
import { InstrumentosService } from '../../service/instrumentos.service';
import { movementosService } from '../../service/movementos.service';
import { BaileService } from '../../service/bailes.service';
import { normalizarTexto } from '../../utils/text-utils';
import { CancionService } from '../../service/cancions.service';



export interface ResultadoBusqueda {
  tipo: string;
  nombre: string;
  provincia: string;
  provinciaId?: string;
  localidad: string;
  datosOriginales: any;
}

@Component({
  selector: 'app-busqueda',
  imports: [CommonModule, FormsModule, DetallesGeneral],
  standalone: true,
  templateUrl: './busqueda-page.html',
  styleUrls: ['./busqueda-page.css']
})
export class BusquedaPage implements OnInit {
  mostrarAvanzados: boolean = false;

  filtrosDisponibles: string[] = [
    'Asociacions', 'Bailes', 'Puntos', 'Lugares',
    'Cancions', 'Instrumentos', 'Movementos'
  ];

  filtrosSeleccionados: string[] = [];

  busquedaPrincipal: string = '';
  busquedaAvanzada = {
    texto: '',
    provincia: '',
    localidad: ''
  };

  resultadosBrutos: ResultadoBusqueda[] = [];
  resultadosFiltrados: ResultadoBusqueda[] = [];

  modalDetalleAberto: boolean = false;
  itemDetalleSeleccionado: any = null;

  constructor(
    private asociacionesService: AsociacionesService,
    private bailesService: BaileService,
    private puntosService: PuntosService,
    private lugaresService: LugaresService,
    private cancionsService: CancionService,
    private instrumentosService: InstrumentosService,
    private movementosService: movementosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTodoElBancoDeDatos();
  }

  toggleAvanzados() {
    this.mostrarAvanzados = !this.mostrarAvanzados;
  }

  toggleFiltro(filtro: string) {
    const index = this.filtrosSeleccionados.indexOf(filtro);
    if (index > -1) {
      this.filtrosSeleccionados.splice(index, 1);
    } else {
      this.filtrosSeleccionados.push(filtro);
    }
    this.aplicarFiltrosDeTexto();
  }

  esFiltroActivo(filtro: string): boolean {
    return this.filtrosSeleccionados.includes(filtro);
  }

  cargarTodoElBancoDeDatos() {
    forkJoin([
      this.mapService(this.asociacionesService.findAll(), 'ASOCIACIÓN'),
      this.mapService(this.bailesService.findAll(), 'BAILE'),
      this.mapService(this.puntosService.findAll(), 'PUNTO'),
      this.mapService(this.lugaresService.findAll(), 'LUGAR'),
      this.mapService(this.cancionsService.findAll(), 'CANCIÓN'),
      this.mapService(this.instrumentosService.findAll(), 'INSTRUMENTO'),
      this.mapService(this.movementosService.findAll(), 'MOVEMENTO')
    ]).subscribe({
      next: (resultadosMultiples) => {
        this.resultadosBrutos = resultadosMultiples.flat();
        this.aplicarFiltrosDeTexto();
      },
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  private mapService(request: Observable<any[]>, tipo: string): Observable<ResultadoBusqueda[]> {
  return request.pipe(
    map(items => items.map(item => {

      const provincia = (tipo === 'LUGAR')
                        ? item.provincia
                        : item.lugar?.provincia;

      return {
        tipo: tipo,
        nombre: item.nome || item.nombre || item.titulo || 'Sin nombre',
        provincia: provincia?.nome || 'Sin provincia',
        provinciaId: provincia?.id ? provincia.id.toString() : '',
        localidad: (tipo === 'LUGAR') ? item.nome : (item.lugar?.nome || 'Desconocida'),
        datosOriginales: item
      };
    })),
    catchError(() => of([]))
  );
}

  aplicarFiltrosDeTexto() {
    const buscarPrincipal = normalizarTexto(this.busquedaPrincipal);
    const buscarAvanzado = normalizarTexto(this.busquedaAvanzada.texto);
    const buscarProvincia = normalizarTexto(this.busquedaAvanzada.provincia);
    const buscarLocalidad = normalizarTexto(this.busquedaAvanzada.localidad);

    const mapaFiltros: { [key: string]: string } = {
      'Asociacions': 'ASOCIACIÓN', 'Bailes': 'BAILE', 'Puntos': 'PUNTO', 'Lugares': 'LUGAR',
      'Cancions': 'CANCIÓN', 'Instrumentos': 'INSTRUMENTO', 'Movementos': 'MOVEMENTO'
    };

    const tiposPermitidos = this.filtrosSeleccionados.map(f => mapaFiltros[f]);

    this.resultadosFiltrados = this.resultadosBrutos.filter(item => {
      const pasaFiltroPill = tiposPermitidos.length === 0 ? true : tiposPermitidos.includes(item.tipo);

      const matchPrincipal = buscarPrincipal ? normalizarTexto(item.nombre).includes(buscarPrincipal) : true;
      const matchAvanzado = buscarAvanzado ? normalizarTexto(item.nombre).includes(buscarAvanzado) : true;

      const matchProvincia = buscarProvincia
        ? (normalizarTexto(item.provincia).includes(buscarProvincia) ||
           (item.provinciaId && item.provinciaId.includes(buscarProvincia)))
        : true;

      const matchLocalidad = buscarLocalidad ? normalizarTexto(item.localidad).includes(buscarLocalidad) : true;

      return pasaFiltroPill && matchPrincipal && matchAvanzado && matchProvincia && matchLocalidad;
    });

    this.cdr.detectChanges();
  }

  abrirDetallePopup(item: ResultadoBusqueda) {
    this.itemDetalleSeleccionado = item.datosOriginales;
    this.modalDetalleAberto = true;
    this.cdr.detectChanges();
  }
}
