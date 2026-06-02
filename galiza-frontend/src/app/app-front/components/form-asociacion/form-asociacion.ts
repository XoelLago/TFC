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

  // Modelo interno blindado
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

    this.bailesFiltrados = this.listaBailes;
    this.cancionsFiltradas = this.listaCancions;
    this.eventosFiltrados = this.listaEventos;

    if (this.datos) {
      // Copiamos datos pero aseguramos que las coords nunca se vuelvan null (mismo patrón que FormLugar)
      this.asociacion = {
        ...this.asociacion,
        ...this.datos,
        lugarId: this.datos.lugar?.id || null,
        coords: this.datos.coords
          ? (typeof this.datos.coords === 'string' ? JSON.parse(this.datos.coords) : { ...this.datos.coords })
          : { lat: 42.75500, lng: -7.86300 }
      };

      if (this.asociacion.lugar) {
        this.textoBusquedaLugar = this.asociacion.lugar.nome;
      }
    }

    this.cdr.detectChanges();
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
    this.baileService.findAll().subscribe(res => { this.listaBailes = res; this.cdr.detectChanges(); });
    this.cancionService.findAll().subscribe(res => { this.listaCancions = res; this.cdr.detectChanges(); });
    this.eventosService.findAll().subscribe(res => { this.listaEventos = res; this.cdr.detectChanges(); });
  }

  private initMiniMap() {
    if (this.mapPick) this.mapPick.remove();

    const lat = this.asociacion.coords?.lat ?? 42.75500;
    const lng = this.asociacion.coords?.lng ?? -7.86300;

    this.mapPick = L.map('mapPickAsociacion').setView([lat, lng], 12);

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: 'Google Hybrid'
    }).addTo(this.mapPick);

    this.pickMarker = L.marker([lat, lng], {
      draggable: true
    }).addTo(this.mapPick);

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

    setTimeout(() => {
      if (this.mapPick) this.mapPick.invalidateSize();
    }, 400);
  }

  toggleAvanzado() {
    this.mostrarAvanzado = !this.mostrarAvanzado;
    this.cdr.detectChanges();
    setTimeout(() => {
      if(this.mapPick) this.mapPick.invalidateSize();
      const body = document.querySelector('.form-body');
      if (body && this.mostrarAvanzado) {
        body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }

  guardar() {
    this.errorMsg = '';
    const nombreNormalizado = this.frontUserService.capitalizarNombre(this.asociacion.nome);

    if (!nombreNormalizado) {
      this.errorMsg = 'O nome da asociación é obrigatorio.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.datos || !this.datos.id) {
      this.asociacionesService.findAll().subscribe(asociaciones => {
        const existe = asociaciones.find(a => this.frontUserService.capitalizarNombre(a.nome) === nombreNormalizado);
        if (existe) {
          this.errorMsg = 'Esta asociación xa existe no sistema.';
          this.cdr.detectChanges();
          return;
        }
        this.ejecutarGuardado();
      });
    } else {
      this.ejecutarGuardado();
    }
  }

  private ejecutarGuardado() {
    const idLugarRaw = this.asociacion.lugar?.id || this.asociacion.lugar?._id;
    const lugarId = idLugarRaw ? Number(idLugarRaw) : null;

    if (!lugarId || isNaN(lugarId)) {
      this.errorMsg = 'Debe seleccionar un Lugar / Sede válido.';
      this.cdr.detectChanges();
      return;
    }

    // ARREGLADO: Mapeamos absolutamente todo lo que soporta la base de datos y el DTO nuevo
    const payload: any = {
      nome: this.frontUserService.capitalizarNombre(this.asociacion.nome),
      lugarId: lugarId,
      coords: { lat: Number(this.asociacion.coords.lat), lng: Number(this.asociacion.coords.lng) },
      tipo: this.asociacion.tipo || 'asociacion',
      icono: this.asociacion.icono || 'groups',
      descripcion: this.asociacion.descripcion || ''
    };

    // Si manejas campo opcional email en el formulario, se incluye aquí
    if (this.asociacion.email) {
      payload.email = this.asociacion.email;
    }

    if (this.asociacion.bailes && this.asociacion.bailes.length > 0) {
      payload.bailesIds = this.asociacion.bailes.map((b: any) => Number(b.id || b._id));
    }

    // CORRECCIÓN CRUCIAL: 'cancionesIds' con "e" para emparejar con el @IsArray() del DTO
    if (this.asociacion.cancions && this.asociacion.cancions.length > 0) {
      payload.cancionesIds = this.asociacion.cancions.map((c: any) => Number(c.id || c._id));
    }

    if (this.asociacion.eventos && this.asociacion.eventos.length > 0) {
      payload.eventosIds = this.asociacion.eventos.map((e: any) => Number(e.id || e._id));
    }

    const idAsociacion = this.datos?.id || this.datos?._id || this.asociacion.id;

    const obs = idAsociacion
      ? this.asociacionesService.update(idAsociacion, payload)
      : this.asociacionesService.create(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
        this.cancelar.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en el servidor:', err);
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.errorMsg = 'Esta asociación xa está rexistrada.';
        } else {
          this.errorMsg = 'Erro ao gardar: Asegúrate de que todos os campos son correctos.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  filtrarLugares(event: any) {
    const valor = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l => l.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  filtrarBailes(event: any) {
    const valor = event.target.value.toLowerCase();
    this.bailesFiltrados = this.listaBailes.filter(b => b.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  filtrarCancions(event: any) {
    const valor = event.target.value.toLowerCase();
    this.cancionsFiltradas = this.listaCancions.filter(c => c.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  filtrarEventos(event: any) {
    const valor = event.target.value.toLowerCase();
    this.eventosFiltrados = this.listaEventos.filter(e => e.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  mostrarLugares = false;
  mostrarBailes = false;
  mostrarCancions = false;
  mostrarEventos = false;

  seleccionarLugar(lugarSeleccionado: Lugar) {
    this.mostrarLugares = false;
    this.asociacion.lugar = lugarSeleccionado;
    this.textoBusquedaLugar = lugarSeleccionado.nome;

    if (lugarSeleccionado.coords) {
      let coordsObj = lugarSeleccionado.coords;
      if (typeof coordsObj === 'string') {
        try { coordsObj = JSON.parse(coordsObj); } catch(e) { console.error(e); }
      }

      if (coordsObj && typeof coordsObj.lat === 'number') {
        this.asociacion.coords = { lat: coordsObj.lat, lng: coordsObj.lng };
        if (this.mapPick && this.pickMarker) {
          const nuevaPosicion = L.latLng(coordsObj.lat, coordsObj.lng);
          this.mapPick.setView(nuevaPosicion, 14);
          this.pickMarker.setLatLng(nuevaPosicion);
        }
      }
    }
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  removerLugar() {
    this.asociacion.lugar = null;
    this.textoBusquedaLugar = '';
    this.cdr.detectChanges();
  }

  removerBaile(nome: string) {
    this.asociacion.bailes = this.asociacion.bailes?.filter((b: any) => b.nome !== nome);
    this.cdr.detectChanges();
  }

  removerCancion(nome: string) {
    this.asociacion.cancions = this.asociacion.cancions?.filter((c: any) => c.nome !== nome);
    this.cdr.detectChanges();
  }

  removerEvento(nome: string) {
    this.asociacion.eventos = this.asociacion.eventos?.filter((e: any) => e.nome !== nome);
    this.cdr.detectChanges();
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
      if (tipo === 'bailes') this.mostrarBailes = false;
      if (tipo === 'cancions') this.mostrarCancions = false;
      if (tipo === 'eventos') this.mostrarEventos = false;
      this.cdr.detectChanges();
    }, 150);
  }
}
