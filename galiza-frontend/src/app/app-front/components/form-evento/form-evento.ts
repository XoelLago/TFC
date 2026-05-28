import { Component, OnInit, Output, EventEmitter, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { EventosService } from '../../service/eventos.service';
import { LugaresService } from '../../service/lugares.service';
// Asume la existencia del servicio de asociaciones
import { Lugar } from '../../models/lugar.model';
import { Asociacion } from '../../models/asociacion.model';
import { TipoEvento } from '../../models/enums';
import { AsociacionesService } from '../../service/asociaciones.service';

@Component({
  selector: 'form-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-evento.html',
  styleUrls: ['./form-evento.css']
})
export class FormEvento implements OnInit {
  @Input() eventoData: any = null;     // Recibe los datos del evento a revisar
  @Input() modoLectura: boolean = false; // Controla si se ocultan los controles de guardado

  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();
  @Output() enviado = new EventEmitter<any>();

  public errorMsg: string = '';
  public Tipos = Object.values(TipoEvento);

  // Modelo del formulario
  public evento: any = {
    nome: '',
    fecha: '', // Bind con datetime-local
    tipo: TipoEvento.FESTIVAL,
    precio: 0.00,
    descripcion: '',
    enlaceExterno: '',
    coords: { lat: 42.755, lng: -7.863 },
    lugar: null,
    asociaciones: []
  };

  // Listados para buscadores
  public listaLugares: Lugar[] = [];
  public lugaresFiltrados: Lugar[] = [];
  public textoBusquedaLugar = '';
  public mostrarLugares = false;

  public listaAsociaciones: Asociacion[] = [];
  public asociacionesFiltradas: Asociacion[] = [];
  public textoBusquedaAso = '';
  public mostrarAsociaciones = false;

  private mapPick!: L.Map;
  private pickMarker: L.Marker | null = null;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private eventosService: EventosService,
    private lugaresService: LugaresService,
    private asociacionesService: AsociacionesService
  ) {}

  ngOnInit() {
    this.cargarDatos();
    setTimeout(() => this.initMiniMap(), 300);
  }

  cargarDatos() {
    this.lugaresService.getLugares().subscribe(res => {
      this.listaLugares = res;
      this.lugaresFiltrados = res;
    });
    this.asociacionesService.findAll().subscribe(res => {
      this.listaAsociaciones = res;
      this.asociacionesFiltradas = res;
    });
  }

  private initMiniMap() {
    if (this.mapPick) this.mapPick.remove();
    this.mapPick = L.map('mapPickEvento').setView([this.evento.coords.lat, this.evento.coords.lng], 12);
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}').addTo(this.mapPick);
    this.pickMarker = L.marker([this.evento.coords.lat, this.evento.coords.lng], { draggable: true }).addTo(this.mapPick);

    this.pickMarker.on('drag', (e: any) => {
      this.zone.run(() => {
        const pos = e.target.getLatLng();
        this.evento.coords = { lat: pos.lat, lng: pos.lng };
        this.cdr.detectChanges();
      });
    });

    this.mapPick.on('click', (e: L.LeafletMouseEvent) => {
      this.zone.run(() => {
        this.evento.coords = { lat: e.latlng.lat, lng: e.latlng.lng };
        this.pickMarker?.setLatLng(e.latlng);
        this.cdr.detectChanges();
      });
    });
    setTimeout(() => this.mapPick.invalidateSize(), 400);
  }

  // --- Buscador LUGAR (Selección única) ---
  filtrarLugares(event: any) {
    const v = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l => l.nome.toLowerCase().includes(v));
  }

  seleccionarLugar(lugar: Lugar) {
    this.evento.lugar = lugar;
    this.textoBusquedaLugar = lugar.nome; // Mostrar el nombre seleccionado en el input
    this.mostrarLugares = false;
  }

  quitarLugar() {
    this.evento.lugar = null;
    this.textoBusquedaLugar = '';
  }

  // --- Buscador ASOCIACIONES (Selección múltiple / Chips) ---
  filtrarAsociaciones(event: any) {
    const v = event.target.value.toLowerCase();
    this.asociacionesFiltradas = this.listaAsociaciones.filter(a => a.nome.toLowerCase().includes(v));
  }

  seleccionarAsociacion(aso: Asociacion) {
    const existe = this.evento.asociaciones.some((a:any) => a.id === aso._id);
    if (!existe) this.evento.asociaciones.push(aso);
    this.textoBusquedaAso = '';
    this.mostrarAsociaciones = false;
  }

  removerAso(id: number) {
    this.evento.asociaciones = this.evento.asociaciones.filter((a:any) => a.id !== id);
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugar') this.mostrarLugares = false;
      if (tipo === 'aso') this.mostrarAsociaciones = false;
    }, 200);
  }

  guardar() {
    // Validaciones
    if (!this.evento.nome || !this.evento.fecha || !this.evento.lugar) {
      this.errorMsg = 'Nome, Data e Lugar son obrigatorios.';
      return;
    }

    const payload = {
      nome: this.evento.nome.trim(),
      fecha: new Date(this.evento.fecha),
      tipo: this.evento.tipo,
      precio: this.evento.precio,
      descripcion: this.evento.descripcion,
      enlaceExterno: this.evento.enlaceExterno,
      coords: this.evento.coords,
      lugar: this.evento.lugar,
      asociaciones: this.evento.asociaciones,
      publicado: false
    };

    // 1. Crear Evento
    this.eventosService.crearEvento(payload).subscribe({
      next: (evtCreado) => {
        // 2. Crear Solicitud Automáticamente
        const solicitud = {
          estado: 'PENDIENTE',
          evento: evtCreado.id // Enviamos el ID para la relación OneToOne
        };

        this.eventosService.crearSolicitud(solicitud).subscribe({
          next: () => {
            this.errorMsg = '';
            this.guardado.emit(evtCreado);
          },
          error: (errSol) => {
            console.error('Error creando solicitud:', errSol);
            // Aunque falle la solicitud, el evento se creó. Avisamos o emitimos.
            this.guardado.emit(evtCreado);
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Erro ao crear o evento.';
        console.error(err);
      }
    });
  }
}
