import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

// Servicios
import { LugaresService } from '../../service/lugares.service';
import { EventosService } from '../../service/eventos.service';
import { ProvinciaService } from '../../service/provincias.service';
import { BaileService } from '../../service/bailes.service';
import { CancionService } from '../../service/canciones.service';
import { Lugar } from '../../models/lugar.model';
import { Provincia } from '../../models/provincia.model';
import { Baile } from '../../models/baile.model';
import { Cancion } from '../../models/cancion.model';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-form-lugar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-lugar.html',
  styleUrls: ['./form-lugar.css']
})
export class FormLugar implements OnInit {
@Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';
  public mostrarAvanzado: boolean = false;

  // Listas de datos
  public provincias: Provincia[] = [];
  public listaBailes: Baile[] = [];
  public listaCancions: Cancion[] = [];
  public listaEventos: Evento[] = [];
public bailesFiltrados: Baile[] = [];
public cancionsFiltradas: Cancion[] = [];
public eventosFiltrados: Evento[] = [];

public textoBusquedaBaile: string = '';
public textoBusquedaCancion: string = '';
public textoBusquedaEvento: string = '';

public provinciaSeleccionadaId: string = '';
  // Mapa
  private mapPick!: L.Map;
  private pickMarker: L.Marker | null = null;

  // Modelo
  public lugar: Lugar = {
    _id: '',             // Propiedad faltante
    tipo: 'lugar',       // Propiedad faltante
    icono: '',
    nome: '',
    descripcion: '',
    coords: { lat: 42.75500, lng: -7.86300 },
    provincia: undefined,
    bailes: [],
    cancions: [],
    eventos: []
  };

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private lugaresService: LugaresService,
    private provinciaService: ProvinciaService,
    private baileService: BaileService,
    private cancionService: CancionService,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCombos();
    this.bailesFiltrados = this.listaBailes;
  this.cancionsFiltradas = this.listaCancions;
  this.eventosFiltrados = this.listaEventos;

    if (this.datos) {
      this.lugar = {
        ...this.datos,
        provinciaId: this.datos.provincia?.id || null,
        coords: this.datos.coords ? { ...this.datos.coords } : { lat: 42.755, lng: -7.863 }
      };
    }

    setTimeout(() => this.initMiniMap(), 300);
  }

  private cargarDatosCombos() {
    this.provinciaService.findAll().subscribe({
      next: (res) => { this.provincias = res; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando provincias:', err)
    });
    this.baileService.findAll().subscribe(res => this.listaBailes = res);
    this.cancionService.findAll().subscribe(res => this.listaCancions = res);
    this.eventosService.findAll().subscribe(res => this.listaEventos = res);
  }

  private initMiniMap() {
    if (this.mapPick) this.mapPick.remove();

    this.mapPick = L.map('mapPickLugar').setView([this.lugar.coords.lat, this.lugar.coords.lng], 12);

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: 'Google Hybrid'
    }).addTo(this.mapPick);

    this.pickMarker = L.marker([this.lugar.coords.lat, this.lugar.coords.lng], {
      draggable: true
    }).addTo(this.mapPick);

    // EVENTOS DE ACTUALIZACIÓN (NgZone + Objeto nuevo para detección de cambios)
    this.pickMarker.on('drag', (e: any) => {
      this.zone.run(() => {
        const pos = e.target.getLatLng();
        this.lugar.coords = { lat: pos.lat, lng: pos.lng };
        this.cdr.detectChanges();
      });
    });

    this.mapPick.on('click', (e: L.LeafletMouseEvent) => {
      this.zone.run(() => {
        this.lugar.coords = { lat: e.latlng.lat, lng: e.latlng.lng };
        this.pickMarker?.setLatLng(e.latlng);
        this.cdr.detectChanges();
      });
    });

    setTimeout(() => this.mapPick.invalidateSize(), 400);
  }

  toggleAvanzado() {
    this.mostrarAvanzado = !this.mostrarAvanzado;
    // Pequeño timeout para esperar que el DOM se renderice y bajar el scroll
    setTimeout(() => {
      if(this.mapPick) this.mapPick.invalidateSize();
      const body = document.querySelector('.form-body');
      if (body && this.mostrarAvanzado) {
        body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }

  guardar() {
  // 1. Validación: Usamos la variable temporal de la provincia para validar
  if (!this.lugar.nome.trim() || !this.provinciaSeleccionadaId) {
    this.errorMsg = 'O nome e a provincia son obrigatorios.';
    return;
  }

  // 2. Sincronizar provincia (Buscamos el objeto completo para que el modelo esté sano)
  const provEncontrada = this.provincias.find(p => p._id === this.provinciaSeleccionadaId);

  // 3. Construir el Payload final
  // Aseguramos que bailes, cancions y eventos sean arrays (aunque estén vacíos)
  const payload: Lugar = {
    ...this.lugar,
    provincia: provEncontrada,
    bailes: this.lugar.bailes || [],
    cancions: this.lugar.cancions || [],
    eventos: this.lugar.eventos || [],
  };

  // 4. Decidir si es creación o actualización
  // Usamos el _id de Mongo que es el que tiene tu interfaz
  const idLugar = this.datos?._id || this.lugar._id;

  const obs = idLugar
    ? this.lugaresService.actualizarLugar(idLugar, payload)
    : this.lugaresService.crearLugar(payload);

  obs.subscribe({
    next: (res) => {
      this.errorMsg = '';
      this.guardado.emit(res);
    },
    error: (err) => {
      console.error('Erro ao gardar:', err);
      this.errorMsg = 'Erro ao gardar os datos no servidor.';
    }
  });
}

  filtrarBailes(event: any) {
  const valor = event.target.value.toLowerCase();
  this.bailesFiltrados = this.listaBailes.filter(b =>
    b.nome.toLowerCase().includes(valor)
  );
}

filtrarCancions(event: any) {
  const valor = event.target.value.toLowerCase();
  this.cancionsFiltradas = this.listaCancions.filter(c =>
    c.nome.toLowerCase().includes(valor)
  );
}

filtrarEventos(event: any) {
  const valor = event.target.value.toLowerCase();
  this.eventosFiltrados = this.listaEventos.filter(e =>
    e.nome.toLowerCase().includes(valor)
  );
}
// Variables de control de visibilidad
mostrarBailes = false;
mostrarCancions = false;
mostrarEventos = false;

// Funciones de selección (ejemplo para baile, haz igual para los otros)
seleccionarBaile(nome: string) {
  this.textoBusquedaBaile = nome; // Guardamos el nombre en la variable de texto
  this.mostrarBailes = false;

  // Buscamos el objeto Baile completo en tu lista maestra
  const baileCompleto = this.listaBailes.find(b => b.nome === nome);

  // Lo asignamos al array del objeto lugar (si existe lo metemos en un array)
  this.lugar.bailes = baileCompleto ? [baileCompleto] : [];
}

seleccionarCancion(nome: string) {
  this.textoBusquedaCancion = nome;
  this.mostrarCancions = false;
  const cancionCompleta = this.listaCancions.find(c => c.nome === nome);
  this.lugar.cancions = cancionCompleta ? [cancionCompleta] : [];
}

seleccionarEvento(nome: string) {
  this.textoBusquedaEvento = nome;
  this.mostrarEventos = false;
  const eventoCompleto = this.listaEventos.find(e => e.nome === nome);
  this.lugar.eventos = eventoCompleto ? [eventoCompleto] : [];
}

// Función para cerrar la lista al pinchar fuera
ocultarLista(tipo: string) {
  setTimeout(() => {
    if (tipo === 'bailes') this.mostrarBailes = false;
    if (tipo === 'cancions') this.mostrarCancions = false;
    if (tipo === 'eventos') this.mostrarEventos = false;
  }, 150); // Un pequeño retraso para permitir que el click registre primero
}
}
