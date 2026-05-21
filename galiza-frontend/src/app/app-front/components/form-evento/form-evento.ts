import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

// Servicios y Modelos
import { EventosService } from '../../service/eventos.service';
import { LugaresService } from '../../service/lugares.service';
import { FrontUserService } from '../../service/front-user.service';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-evento.html',
  styleUrls: ['./form-evento.css']
})
export class FormEvento implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';

  // Gestión del Mapa
  private mapPick!: L.Map;
  private pickMarker: L.Marker | null = null;

  // Listas para el buscador relacional de Lugares
  public listaLugares: any[] = [];
  public lugaresFiltrados: any[] = [];
  public textoBusquedaLugar: string = '';
  public mostrarLugares: boolean = false;
  public lugarSeleccionadoId: string | null = null;

  // Campo personalizado local
  public direccion: string = '';

  // Modelo adaptado a la captura de la base de datos
  public evento: any = {
    id: '',
    nome: '',
    fecha: '',
    coords: { lat: 42.75500, lng: -7.86300 },
    tipo: 'evento',
    precio: 0,
    icono: 'event',
    descripcion: '',
    enlaceExterno: '',
    publicado: true,
    lugarId: null
  };

  constructor(
    private eventosService: EventosService,
    private lugaresService: LugaresService,
    private frontUserService: FrontUserService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarLugares();

    if (this.datos) {
      // Mapeamos los datos existentes al modelo
      this.evento = {
        ...this.datos,
        coords: this.datos.coords ? { ...this.datos.coords } : { lat: 42.755, lng: -7.863 }
      };

      // Si tiene un lugar asignado, rellenamos el buscador flotante
      if (this.datos.lugar || this.datos.lugarId) {
        this.lugarSeleccionadoId = this.datos.lugar?.id || this.datos.lugarId;
        this.textoBusquedaLugar = this.datos.lugar?.nome || 'Lugar asignado';
      }

      // Tratar la descripción para extraer la Dirección (Evita duplicados visuales)
      if (this.evento.descripcion && this.evento.descripcion.includes('Dirección: ')) {
        const partes = this.evento.descripcion.split('Dirección: ');
        this.evento.descripcion = partes[0].trim(); // Deja solo el texto real
        this.direccion = partes[1].trim();          // Pone la dirección en su input
      }
    }

    setTimeout(() => this.initMiniMap(), 300);
  }

  private cargarLugares() {
    this.lugaresService.getLugares().subscribe({
      next: (res) => {
        this.listaLugares = res;
        this.lugaresFiltrados = res;
      },
      error: (err) => console.error('Erro cargando lugares para combo:', err)
    });
  }

  private initMiniMap() {
    if (this.mapPick) this.mapPick.remove();

    this.mapPick = L.map('mapPickEvento').setView([this.evento.coords.lat, this.evento.coords.lng], 12);

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: 'Google Hybrid'
    }).addTo(this.mapPick);

    this.pickMarker = L.marker([this.evento.coords.lat, this.evento.coords.lng], {
      draggable: true
    }).addTo(this.mapPick);

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

  // --- LÓGICA DEL BUSCADOR DE LUGARES ---
  filtrarLugares(event: any) {
    const valor = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l =>
      l.nome.toLowerCase().includes(valor)
    );
  }

  seleccionarLugar(lugar: any) {
    this.mostrarLugares = false;
    this.lugarSeleccionadoId = lugar.id;
    this.textoBusquedaLugar = lugar.nome;
    this.evento.lugarId = lugar.id;
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
    }, 150);
  }

  // --- GUARDADO DE DATOS ---
  guardar() {
    // Validaciones obligatorias básicas
    if (!this.evento.nome || !this.evento.fecha || !this.lugarSeleccionadoId) {
      this.errorMsg = 'O nome, a data e o lugar asociado son campos obrigatorios.';
      return;
    }

    // Unir la descripción original con la dirección en el formato solicitado
    let descripcionFinal = this.evento.descripcion || '';
    if (this.direccion.trim()) {
      descripcionFinal += (descripcionFinal ? '\n' : '') + `Dirección: ${this.direccion.trim()}`;
    }

    // Payload final unificado listo para enviar a la base de datos
    const payload: any = {
      nome: this.frontUserService.capitalizarNombre(this.evento.nome),
      fecha: this.evento.fecha,
      coords: this.evento.coords,
      tipo: this.evento.tipo || 'evento',
      precio: Number(this.evento.precio) || 0,
      icono: this.evento.icono || 'event',
      descripcion: descripcionFinal,
      enlaceExterno: this.evento.enlaceExterno || '',
      publicado: !!this.evento.publicado,
      lugarId: this.lugarSeleccionadoId
    };

    const idEvento = this.datos?.id || this.evento.id;

    const obs = idEvento
      ? this.eventosService.update(idEvento, payload)
      : this.eventosService.create(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
      },
      error: (err) => {
        console.error('Erro ao gardar o evento:', err);
        this.errorMsg = 'Erro no servidor ao procesar o evento.';
      }
    });
  }
}
