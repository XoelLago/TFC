import { Component, OnInit, Output, EventEmitter, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { EventosService } from '../../service/eventos.service';
import { LugaresService } from '../../service/lugares.service';
import { AsociacionesService } from '../../service/asociaciones.service';
import { Lugar } from '../../models/lugar.model';
import { Asociacion } from '../../models/asociacion.model';
import { TipoEvento } from '../../models/enums';

@Component({
  selector: 'form-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-evento.html',
  styleUrls: ['./form-evento.css']
})
export class FormEvento implements OnInit {
  @Input() eventoData: any = null;
  @Input() modoLectura: boolean = false;

  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();
  @Output() enviado = new EventEmitter<any>();

  public errorMsg: string = '';
  public Tipos = Object.values(TipoEvento);

  public evento: any = {
    nome: '',
    fecha: '',
    tipo: TipoEvento.FESTIVAL,
    precio: 0.00,
    descripcion: '',
    enlaceExterno: '',
    coords: { lat: 42.755, lng: -7.863 },
    lugar: null,
    asociaciones: []
  };

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
    this.lugaresService.findAll().subscribe(res => {
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

  filtrarLugares(event: any) {
    const v = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l => l.nome.toLowerCase().includes(v));
  }

  seleccionarLugar(lugar: Lugar) {
    this.evento.lugar = lugar;
    this.textoBusquedaLugar = lugar.nome;
    this.mostrarLugares = false;
  }

  quitarLugar() {
    this.evento.lugar = null;
    this.textoBusquedaLugar = '';
  }

  filtrarAsociaciones(event: any) {
    const v = event.target.value.toLowerCase();
    this.asociacionesFiltradas = this.listaAsociaciones.filter(a => a.nome.toLowerCase().includes(v));
  }

  seleccionarAsociacion(aso: any) {
    const idReal = aso.id || aso._id;
    const existe = this.evento.asociaciones.some((a:any) => (a.id || a._id) === idReal);

    if (!existe) {
      this.evento.asociaciones.push({
        id: idReal,
        nome: aso.nome
      });
    }
    this.textoBusquedaAso = '';
    this.mostrarAsociaciones = false;
  }

  removerAso(id: number) {
    this.evento.asociaciones = this.evento.asociaciones.filter((a:any) => (a.id || a._id) !== id);
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugar') this.mostrarLugares = false;
      if (tipo === 'aso') this.mostrarAsociaciones = false;
    }, 200);
  }

  guardar() {
    if (!this.evento.nome || !this.evento.fecha || !this.evento.lugar) {
      this.errorMsg = 'Nome, Data e Lugar son obrigatorios.';
      return;
    }

    const payload = {
      nome: this.evento.nome.trim(),
      fecha: new Date(this.evento.fecha),
      tipo: this.evento.tipo,
      precio: this.evento.precio ? Number(this.evento.precio) : 0,
      descripcion: this.evento.descripcion || '',
      enlaceExterno: this.evento.enlaceExterno || '',
      coords: {
        lat: Number(this.evento.coords.lat),
        lng: Number(this.evento.coords.lng)
      },
      lugar: { id: this.evento.lugar.id || this.evento.lugar._id },
      asociaciones: this.evento.asociaciones.map((a: any) => ({ id: a.id || a._id })),
      publicado: false
    };

    this.eventosService.crearEvento(payload).subscribe({
      next: (evtCreado) => {
        const solicitud = {
          estado: 'PENDIENTE',
          eventoId:  evtCreado.id
        };

        this.eventosService.crearSolicitud(solicitud).subscribe({
          next: () => {
            this.errorMsg = '';
            this.guardado.emit(evtCreado);
          },
          error: (errSol) => {
            console.error('Error creando solicitud:', errSol);
            this.guardado.emit(evtCreado);
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Erro ao crear o evento. Revisa a consola.';
        console.error('Error del backend:', err);
      }
    });
  }
}
