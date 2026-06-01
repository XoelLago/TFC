import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

// Servicios
import { AsociacionesService } from '../../service/asociaciones.service';
import { LugaresService } from '../../service/lugares.service';
import { EventosService } from '../../service/eventos.service';
import { BaileService } from '../../service/bailes.service';
import { CancionService } from '../../service/canciones.service';
import { FrontUserService } from '../../service/front-user.service';

// Modelos
import { Lugar } from '../../models/lugar.model';
import { Baile } from '../../models/baile.model';
import { Cancion } from '../../models/cancion.model';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-form-asociacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-asociacion.html',
  styleUrls: ['./form-asociacion.css']
})
export class FormAsociacion implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';
  public mostrarAvanzado: boolean = false;

  // Listas de datos
  public listaLugares: Lugar[] = [];
  public listaBailes: Baile[] = [];
  public listaCancions: Cancion[] = [];
  public listaEventos: Evento[] = [];

  public lugaresFiltrados: Lugar[] = [];
  public bailesFiltrados: Baile[] = [];
  public cancionsFiltradas: Cancion[] = [];
  public eventosFiltrados: Evento[] = [];

  public textoBusquedaLugar: string = '';
  public textoBusquedaBaile: string = '';
  public textoBusquedaCancion: string = '';
  public textoBusquedaEvento: string = '';

  // Mapa
  private mapPick!: L.Map;
  private pickMarker: L.Marker | null = null;

  // Modelo exacto como el de Lugar
  public asociacion: any = {
    id: '',
    tipo: 'asociacion',
    icono: 'groups',
    nome: '',
    descripcion: '',
    coords: { lat: 42.75500, lng: -7.86300 },
    lugar: null,
    bailes: [],
    cancions: [],
    eventos: []
  };

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private asociacionesService: AsociacionesService,
    private lugaresService: LugaresService,
    private baileService: BaileService,
    private cancionService: CancionService,
    private eventosService: EventosService,
    private frontUserService: FrontUserService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCombos();

    // Inicializar listas filtradas
    this.bailesFiltrados = this.listaBailes;
    this.cancionsFiltradas = this.listaCancions;
    this.eventosFiltrados = this.listaEventos;

    if (this.datos) {
      this.asociacion = {
        ...this.datos,
        coords: this.datos.coords ? { ...this.datos.coords } : { lat: 42.755, lng: -7.863 }
      };

      if (this.asociacion.lugar) {
        this.textoBusquedaLugar = this.asociacion.lugar.nome;
      }
    }

    setTimeout(() => this.initMiniMap(), 300);
  }

  private cargarDatosCombos() {
    this.lugaresService.findAll().subscribe({
      next: (res) => {
        this.listaLugares = res;
        this.lugaresFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando lugares:', err)
    });
    this.baileService.findAll().subscribe(res => this.listaBailes = res);
    this.cancionService.findAll().subscribe(res => this.listaCancions = res);
    this.eventosService.findAll().subscribe(res => this.listaEventos = res);
  }

  // --- LÓGICA DE MAPA CALCADA AL FORM-LUGAR ---
  private initMiniMap() {
  if (this.mapPick) this.mapPick.remove();

  // Asegúrate de que el ID aquí coincide con el del HTML
  this.mapPick = L.map('mapPickAsociacion').setView([this.asociacion.coords.lat, this.asociacion.coords.lng], 12);

  L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: 'Google Hybrid'
  }).addTo(this.mapPick);

  this.pickMarker = L.marker([this.asociacion.coords.lat, this.asociacion.coords.lng], {
    draggable: true
  }).addTo(this.mapPick);

  // Eventos de arrastrar y hacer click
  this.pickMarker.on('drag', (e: any) => {
    this.zone.run(() => {
      const pos = e.target.getLatLng();
      this.asociacion.coords = { lat: pos.lat, lng: pos.lng };
      this.cdr.detectChanges();
    });
  });

  this.mapPick.on('click', (e: L.LeafletMouseEvent) => {
    this.zone.run(() => {
      this.asociacion.coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      this.pickMarker?.setLatLng(e.latlng);
      this.cdr.detectChanges();
    });
  });

  // ¡ESTO ES CLAVE! Aumenta un pelín el tiempo o asegúrate de ejecutarlo
  setTimeout(() => {
    if (this.mapPick) {
      this.mapPick.invalidateSize();
    }
  }, 400);
}

  toggleAvanzado() {
    this.mostrarAvanzado = !this.mostrarAvanzado;
    setTimeout(() => {
      if(this.mapPick) this.mapPick.invalidateSize();
      const body = document.querySelector('.form-body');
      if (body && this.mostrarAvanzado) {
        body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }

  guardar() {
    const nombreNormalizado = this.frontUserService.capitalizarNombre(this.asociacion.nome);

    if (!nombreNormalizado) {
      this.errorMsg = 'O nome da asociación é obrigatorio.';
      return;
    }

    if (!this.datos) {
      this.asociacionesService.findAll().subscribe(asociaciones => {
        const existe = asociaciones.find(a => this.frontUserService.capitalizarNombre(a.nome) === nombreNormalizado);
        if (existe) {
          this.errorMsg = 'Esta asociación xa existe no sistema.';
          return;
        }
        this.ejecutarGuardado();
      });
    } else {
      this.ejecutarGuardado();
    }
  }

  private ejecutarGuardado() {
    const payload: any = {
      nome: this.frontUserService.capitalizarNombre(this.asociacion.nome),
      coords: this.asociacion.coords,
      tipo: 'asociacion',
      icono: 'groups',
      descripcion: this.asociacion.descripcion || '',
      lugar: this.asociacion.lugar,
      bailes: this.asociacion.bailes || [],
      cancions: this.asociacion.cancions || [],
      eventos: this.asociacion.eventos || []
    };

    const idAsociacion = this.datos?.id || this.datos?._id || this.asociacion.id;

    const obs = idAsociacion
      ? this.asociacionesService.update(idAsociacion, payload)
      : this.asociacionesService.create(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
      },
      error: (err) => {
        console.error('Error en el servidor:', err);
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.errorMsg = 'Esta asociación xa está rexistrada.';
        } else {
          this.errorMsg = 'Erro ao gardar: Asegúrate de que todos os campos son correctos.';
        }
      }
    });
  }

  filtrarLugares(event: any) {
    const valor = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l => l.nome.toLowerCase().includes(valor));
  }

  filtrarBailes(event: any) {
    const valor = event.target.value.toLowerCase();
    this.bailesFiltrados = this.listaBailes.filter(b => b.nome.toLowerCase().includes(valor));
  }

  filtrarCancions(event: any) {
    const valor = event.target.value.toLowerCase();
    this.cancionsFiltradas = this.listaCancions.filter(c => c.nome.toLowerCase().includes(valor));
  }

  filtrarEventos(event: any) {
    const valor = event.target.value.toLowerCase();
    this.eventosFiltrados = this.listaEventos.filter(e => e.nome.toLowerCase().includes(valor));
  }

  mostrarLugares = false;
  mostrarBailes = false;
  mostrarCancions = false;
  mostrarEventos = false;

  seleccionarLugar(lugarSeleccionado: Lugar) {
    this.mostrarLugares = false;
    this.asociacion.lugar = lugarSeleccionado;
    this.textoBusquedaLugar = lugarSeleccionado.nome;
  }

  seleccionarBaile(nome: string) {
    this.mostrarBailes = false;
    const baileCompleto = this.listaBailes.find(b => b.nome === nome);
    if (baileCompleto) {
      if (!this.asociacion.bailes) this.asociacion.bailes = [];
      const existe = this.asociacion.bailes.some((b: any) => b._id === baileCompleto._id || b.nome === baileCompleto.nome);
      if (!existe) this.asociacion.bailes.push(baileCompleto);
    }
    this.textoBusquedaBaile = '';
    this.bailesFiltrados = this.listaBailes;
  }

  seleccionarCancion(nome: string) {
    this.mostrarCancions = false;
    const cancionCompleta = this.listaCancions.find(c => c.nome === nome);
    if (cancionCompleta) {
      if (!this.asociacion.cancions) this.asociacion.cancions = [];
      const existe = this.asociacion.cancions.some((c: any) => c._id === cancionCompleta._id || c.nome === cancionCompleta.nome);
      if (!existe) this.asociacion.cancions.push(cancionCompleta);
    }
    this.textoBusquedaCancion = '';
    this.cancionsFiltradas = this.listaCancions;
  }

  seleccionarEvento(nome: string) {
    this.mostrarEventos = false;
    const eventoCompleto = this.listaEventos.find(e => e.nome === nome);
    if (eventoCompleto) {
      if (!this.asociacion.eventos) this.asociacion.eventos = [];
      const existe = this.asociacion.eventos.some((e: any) => e._id === eventoCompleto._id || e.nome === eventoCompleto.nome);
      if (!existe) this.asociacion.eventos.push(eventoCompleto);
    }
    this.textoBusquedaEvento = '';
    this.eventosFiltrados = this.listaEventos;
  }

  removerLugar() {
    this.asociacion.lugar = null;
    this.textoBusquedaLugar = '';
  }

  removerBaile(nome: string) {
    this.asociacion.bailes = this.asociacion.bailes?.filter((b: any) => b.nome !== nome);
  }

  removerCancion(nome: string) {
    this.asociacion.cancions = this.asociacion.cancions?.filter((c: any) => c.nome !== nome);
  }

  removerEvento(nome: string) {
    this.asociacion.eventos = this.asociacion.eventos?.filter((e: any) => e.nome !== nome);
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
      if (tipo === 'bailes') this.mostrarBailes = false;
      if (tipo === 'cancions') this.mostrarCancions = false;
      if (tipo === 'eventos') this.mostrarEventos = false;
    }, 150);
  }
}
