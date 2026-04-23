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
import { FrontUserService } from '../../service/front-user.service';

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
    id: '',
    tipo: 'lugar',
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
    private eventosService: EventosService,
    private frontUserService: FrontUserService
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

    // eventps de actualizacion (NgZone + Objeto nuevo para detección de cambios)
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
  const nombreNormalizado = this.frontUserService.capitalizarNombre(this.lugar.nome);

  // Validación de campos obligatorios
  if (!nombreNormalizado || !this.provinciaSeleccionadaId) {
    this.errorMsg = 'O nome e a provincia son obrigatorios.';
    return;
  }

  // Control de duplicados (solo si es un registro nuevo)
  // Esto asume que tienes la lista de lugares cargada o el servicio tiene un buscador
  if (!this.datos) {
     this.lugaresService.getLugares().subscribe(lugares => {
        const existe = lugares.find(l => this.frontUserService.capitalizarNombre(l.nome) === nombreNormalizado);
        if (existe) {
           this.errorMsg = 'Este lugar ya existe en el sistema.';
           return;
        }
        this.ejecutarGuardado();
     });
  } else {
     this.ejecutarGuardado();
  }
}

private ejecutarGuardado() {
  // Buscamos el objeto provincia. Forzamos comparación de string/number
  const provEncontrada = this.provincias.find(p =>
    String(p.id) === String(this.provinciaSeleccionadaId) ||
    String(p.id) === String(this.provinciaSeleccionadaId)
  );

  if (!provEncontrada) {
    this.errorMsg = 'A provincia seleccionada no es válida.';
    return;
  }

  // Construcción del Payload exacto para TypeORM
  const payload: any = {
    nome: this.frontUserService.capitalizarNombre(this.lugar.nome),
    coords: this.lugar.coords,
    tipo: 'lugar',
    icono: this.lugar.icono || 'castle',
    descripcion: this.lugar.descripcion || '',
    // Enviamos el objeto completo para que TypeORM rellene 'provinciaId'
    provincia: provEncontrada,
    // Aseguramos que los arrays de relaciones JSON no vayan como null
    bailes: this.lugar.bailes || [],
    cancions: this.lugar.cancions || [],
    eventos: this.lugar.eventos || []
  };

  // Determinamos el ID para saber si es UPDATE o CREATE
  const idLugar = this.datos?.id || this.datos?._id || this.lugar.id;

  const obs = idLugar
    ? this.lugaresService.actualizarLugar(idLugar, payload)
    : this.lugaresService.crearLugar(payload);

  obs.subscribe({
    next: (res) => {
      this.errorMsg = '';
      this.guardado.emit(res);
    },
    error: (err) => {
      console.error('Error en el servidor:', err);
      // Capturamos el error de duplicado si viene del backend (Unique constraint)
      if (err.status === 409 || err.error?.message?.includes('duplicate')) {
        this.errorMsg = 'Este lugar xa está rexistrado.';
      } else {
        this.errorMsg = 'Erro ao gardar: Asegúrate de que todos los campos son correctos.';
      }
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

seleccionarBaile(nome: string) {
  this.mostrarBailes = false;
  const baileCompleto = this.listaBailes.find(b => b.nome === nome);

  if (baileCompleto) {
    if (!this.lugar.bailes) this.lugar.bailes = []; // Por si acaso es null

    // Evitamos duplicados
    const existe = this.lugar.bailes.some(b => b._id === baileCompleto._id || b.nome === baileCompleto.nome);
    if (!existe) {
      this.lugar.bailes.push(baileCompleto);
    }
  }
  // Vaciamos el input para que pueda buscar otro
  this.textoBusquedaBaile = '';
  this.bailesFiltrados = this.listaBailes;
}

seleccionarCancion(nome: string) {
  this.mostrarCancions = false;
  const cancionCompleta = this.listaCancions.find(c => c.nome === nome);

  if (cancionCompleta) {
    if (!this.lugar.cancions) this.lugar.cancions = [];

    const existe = this.lugar.cancions.some(c => c._id === cancionCompleta._id || c.nome === cancionCompleta.nome);
    if (!existe) {
      this.lugar.cancions.push(cancionCompleta);
    }
  }
  this.textoBusquedaCancion = '';
  this.cancionsFiltradas = this.listaCancions;
}

seleccionarEvento(nome: string) {
  this.mostrarEventos = false;
  const eventoCompleto = this.listaEventos.find(e => e.nome === nome);

  if (eventoCompleto) {
    if (!this.lugar.eventos) this.lugar.eventos = [];

    const existe = this.lugar.eventos.some(e => e._id === eventoCompleto._id || e.nome === eventoCompleto.nome);
    if (!existe) {
      this.lugar.eventos.push(eventoCompleto);
    }
  }
  this.textoBusquedaEvento = '';
  this.eventosFiltrados = this.listaEventos;
}

// --- FUNCIONES PARA QUITAR CHIPS ---

removerBaile(nome: string) {
  this.lugar.bailes = this.lugar.bailes?.filter(b => b.nome !== nome);
}

removerCancion(nome: string) {
  this.lugar.cancions = this.lugar.cancions?.filter(c => c.nome !== nome);
}

removerEvento(nome: string) {
  this.lugar.eventos = this.lugar.eventos?.filter(e => e.nome !== nome);
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
