import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


// IMPORTAMOS TU COMPONENTE DE DETALLES
import { DetallesGeneral } from '../../components/detalles-general/detalles-general';

import { AsociacionesService } from '../../service/asociaciones.service';
import { PuntosService } from '../../service/puntos.service';
import { LugaresService } from '../../service/lugares.service';
import { InstrumentosService } from '../../service/instrumentos.service';
import { MovimientosService } from '../../service/movimientos.service';
import { BaileService } from '../../service/bailes.service';
import { CancionService } from '../../service/canciones.service';
import { ProvinciaService } from '../../service/provincias.service';
import { normalizarTexto } from '../../utils/text-utils';

export interface ResultadoBusqueda {
  tipo: string;
  nombre: string;
  provincia: string;
  localidad: string;
  datosOriginales: any; // 👈 ¡CLAVE! Guardamos el objeto completo para pasarlo al popup
}

@Component({
  selector: 'app-busqueda',
  imports: [CommonModule, FormsModule, DetallesGeneral], // 👈 Añadido aquí
  standalone: true,
  templateUrl: './busqueda-page.html',
  styleUrls: ['./busqueda-page.css']
})
export class BusquedaPage implements OnInit {
  mostrarAvanzados: boolean = false;

  filtrosDisponibles: string[] = [
    'Asociaciones', 'Bailes', 'Puntos', 'Lugares',
    'Canciones', 'Instrumentos', 'Movimientos', 'Provincias'
  ];

  // Empezamos vacío. 0 filtros = Mostrar TODO
  filtrosSeleccionados: string[] = [];

  busquedaPrincipal: string = '';
  busquedaAvanzada = {
    texto: '',
    provincia: '',
    localidad: ''
  };

  resultadosBrutos: ResultadoBusqueda[] = [];
  resultadosFiltrados: ResultadoBusqueda[] = [];

  // Variables para el Modal de Detalles
  modalDetalleAberto: boolean = false;
  itemDetalleSeleccionado: any = null;

  constructor(
    private asociacionesService: AsociacionesService,
    private bailesService: BaileService,
    private puntosService: PuntosService,
    private lugaresService: LugaresService,
    private cancionesService: CancionService,
    private instrumentosService: InstrumentosService,
    private movimientosService: MovimientosService,
    private provinciasService: ProvinciaService,
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
      this.mapService(this.cancionesService.findAll(), 'CANCIÓN'),
      this.mapService(this.instrumentosService.findAll(), 'INSTRUMENTO'),
      this.mapService(this.movimientosService.findAll(), 'MOVIMIENTO'),
      this.mapService(this.provinciasService.findAll(), 'PROVINCIA')
    ]).subscribe({
      next: (resultadosMultiples) => {
        this.resultadosBrutos = resultadosMultiples.flat();
        this.aplicarFiltrosDeTexto();
      },
      error: (err) => console.error('Error al precargar el buscador:', err)
    });
  }

  private mapService(request: Observable<any[]>, tipo: string): Observable<ResultadoBusqueda[]> {
    return request.pipe(
      map(items => items.map(item => ({
        tipo: tipo,
        nombre: item.nome || item.nombre || 'Sin nombre',
        provincia: item.lugar?.provincia?.nome || item.provincia?.nome || 'Desconocida',
        localidad: item.lugar?.nome || (tipo === 'LUGAR' ? item.nome : 'Desconocida'),
        datosOriginales: item // 👈 Guardamos toda la base de datos de este elemento aquí
      }))),
      catchError(() => of([]))
    );
  }

  aplicarFiltrosDeTexto() {
    const buscarPrincipal = normalizarTexto(this.busquedaPrincipal);
    const buscarAvanzado = normalizarTexto(this.busquedaAvanzada.texto);
    const buscarProvincia = normalizarTexto(this.busquedaAvanzada.provincia);
    const buscarLocalidad = normalizarTexto(this.busquedaAvanzada.localidad);

    const mapaFiltros: { [key: string]: string } = {
      'Asociaciones': 'ASOCIACIÓN', 'Bailes': 'BAILE', 'Puntos': 'PUNTO', 'Lugares': 'LUGAR',
      'Canciones': 'CANCIÓN', 'Instrumentos': 'INSTRUMENTO', 'Movimientos': 'MOVIMIENTO', 'Provincias': 'PROVINCIA'
    };

    const tiposPermitidos = this.filtrosSeleccionados.map(f => mapaFiltros[f]);

    this.resultadosFiltrados = this.resultadosBrutos.filter(item => {

      // 👈 REGLA NUEVA: Si el array de permitidos está vacío, dejamos pasar TODOS
      const pasaFiltroPill = tiposPermitidos.length === 0 ? true : tiposPermitidos.includes(item.tipo);

      const matchPrincipal = buscarPrincipal ? normalizarTexto(item.nombre).includes(buscarPrincipal) : true;
      const matchAvanzado = buscarAvanzado ? normalizarTexto(item.nombre).includes(buscarAvanzado) : true;
      const matchProvincia = buscarProvincia ? normalizarTexto(item.provincia).includes(buscarProvincia) : true;
      const matchLocalidad = buscarLocalidad ? normalizarTexto(item.localidad).includes(buscarLocalidad) : true;

      return pasaFiltroPill && matchPrincipal && matchAvanzado && matchProvincia && matchLocalidad;
    });

    this.cdr.detectChanges();
  }

  // ==========================================
  // APERTURA DE DETALLES
  // ==========================================
  abrirDetallePopup(item: ResultadoBusqueda) {
    // Le pasamos el objeto original con TODOS sus campos al componente de detalles
    this.itemDetalleSeleccionado = item.datosOriginales;
    this.modalDetalleAberto = true;
    this.cdr.detectChanges();
  }
}
