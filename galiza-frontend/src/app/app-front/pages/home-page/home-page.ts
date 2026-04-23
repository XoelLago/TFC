import { Component, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateMarcadorForm, DatosMapa } from '../../models/mapa.model';
import { MapaService } from '../../service/mapa.service';
import { ActionToastComponent } from "../../components/action-toast/action-toast";
import { IsNotEmpty } from 'class-validator';
import { FrontUserService } from '../../service/front-user.service';
import { Router } from '@angular/router';
import { SpeedDialModule, SpeedDial } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { FormLugar } from "../../components/form-lugar/form-lugar";
import { FormEvento } from "../../components/form-evento/form-evento";
import { FormAsociacion } from "../../components/form-asociacion/form-asociacion";
import L from 'leaflet';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionToastComponent, SpeedDialModule, SpeedDial, FormLugar, FormEvento, FormAsociacion],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements AfterViewInit {
  public errorMsg: string = '';

  private map!: L.Map;
  private mapPick!: L.Map;
  private oldMapLayer!: L.TileLayer.WMS;
  private markers: L.Marker[] = [];
  private pickMarker: L.Marker | null = null;

  private boundsGalicia = L.latLngBounds(
    L.latLng(41.5, -10.0),
    L.latLng(44.0, -6.0)
  );
  private centroGalicia: L.LatLngExpression = [42.755, -7.863];

  public showHelp: boolean = false;
  public searchTerm: string = '';
  public searchResults: DatosMapa[] = [];
  public selectedPlace: DatosMapa | null = null;
  public opacity: number = 0;
  public mostrarFormularioMarcadores: boolean = false;
  public mostrarFormAsociacion: boolean = false;
  public mostrarFormEvento: boolean = false;
  public mostrarFormLugar: boolean = false;

  public places: DatosMapa[] = [];
  private lastMarker: L.Marker | null = null;

  public nuevoMarcador: CreateMarcadorForm = {
    nome: '',
    tipo: 'personalizado',
    descripcion: '',
    coords: { lat: 42.755, lng: -7.866 },
    icono: 'star'
  };
  public textoBotonForm: string = 'Gardar';

usuario: Usuario = {
    id: 0,
    nombre: localStorage.getItem('user_nombre') || '',
    rol: (localStorage.getItem('user_rol') as Rol),
  };

  public rolUsuario: string = this.usuario.rol;
 public adminMenuItems: MenuItem[] = [];


  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private mapaService: MapaService,
    private router: Router,
    private frontUserService: FrontUserService
  ) {

    this.adminMenuItems = [
    {
      icon: 'pi pi-star',
      tooltipOptions: { tooltipLabel: 'Marcador Personalizado',tooltipPosition: 'left' },
      command: () => this.abrirFormulario()
    },
    {
      icon: 'material-icons castle',
      tooltipOptions: { tooltipLabel: 'Novo Lugar',tooltipPosition: 'left' },
      command: () => this.mostrarFormLugar = true
    },
    {
      icon: 'theater_comedy',
      tooltipOptions: { tooltipLabel: 'Novo Evento',tooltipPosition: 'left' },
      command: () => this.router.navigate(['/ruta-eventos'])
    },
    {
      icon: 'groups',
      tooltipOptions: { tooltipLabel: 'Nova Asociación',tooltipPosition: 'left' },
      command: () => this.router.navigate(['/ruta-asociaciones'])
    }
  ];

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      this.cargarDatos();
    }, 100);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroGalicia,
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: this.boundsGalicia,
      maxBoundsViscosity: 1.0
    });

    // CAPA FONDO: El Mar (ArcGIS Ocean) - Restaurado
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri',
      zIndex: 1
    }).addTo(this.map);

    // CAPA TERREO: Satélite PNOA (Con transparencia para que se vea el mar debajo)
    L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
      layers: 'OI.OrthoimageCoverage',
      format: 'image/png',
      transparent: true, // Importante para ver el mar de fondo
      version: '1.3.0',
      zIndex: 2
    }).addTo(this.map);

    // CAPA HISTÓRICA: Minutas
    this.oldMapLayer = L.tileLayer.wms('https://www.ign.es/wms/minutas-cartograficas', {
      layers: 'Minutas',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      opacity: this.opacity,
      zIndex: 5
    }).addTo(this.map);

    // CAPA ETIQUETAS: Nombres con "Halo" para que se lean sobre cualquier fondo
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      zIndex: 10
    }).addTo(this.map);

    this.map.on('zoomend', () => this.updateMarkersSize());

    const mapDiv = document.getElementById('map');
    if (mapDiv) mapDiv.style.backgroundColor = '#abd3df'; // Color de seguridad
  }

  private cargarDatos() {
    this.mapaService.getTodoElMapa().subscribe({
      next: (data) => {
        this.places = data;
        this.renderMarkers();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando marcadores:', err)
    });
  }

  private renderMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    this.places.forEach(place => {
      const marker = L.marker(place.coords, {
        icon: this.getCustomIcon(place.tipo, place.icono, this.map.getZoom())
      }).addTo(this.map);
      marker.bindTooltip(`<b>${place.nome}</b>`, { direction: 'top', offset: [0, -35] });
      marker.on('click', () => this.seleccionarLugar(place, marker));
      this.markers.push(marker);
    });
  }

  public seleccionarLugar(place: DatosMapa, marker: L.Marker) {
    this.zone.run(() => {
      if (this.lastMarker) this.lastMarker.setZIndexOffset(0);
      this.selectedPlace = place;
      marker.setZIndexOffset(1000);
      this.lastMarker = marker;
      this.map.flyTo(place.coords, 14);
      this.cdr.detectChanges();
    });
  }

  private updateMarkersSize() {
    const currentZoom = this.map.getZoom();
    this.markers.forEach((marker, index) => {
      const place = this.places[index];
      if (marker.getElement()) {
        marker.setIcon(this.getCustomIcon(place.tipo, place.icono, currentZoom));
      }
    });
  }

  private getCustomIcon(tipo: string, iconName: string, zoom: number) {
    const size = Math.max(30, zoom * 3);
    const fontSize = size * 0.6;
    let color = '#6c757d';
    let icon = iconName;
    if (tipo === 'asociacion') color = '#D4A017';
    else if (tipo === 'evento') color = '#8C2A1C';
    else if (tipo === 'lugar') color = '#B34A32';
    else if (tipo === 'personalizado') { color = '#333'; icon = 'star'; }

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin marker-${tipo}" style="width:${size}px; height:${size}px; background-color: white; border: 2px solid ${color}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
               <span class="material-icons" style="font-size:${fontSize}px; color: ${color}; transform: rotate(45deg);">${icon}</span>
             </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size]
    });
  }

  updateOpacity() {
    if (this.oldMapLayer) this.oldMapLayer.setOpacity(this.opacity);
  }

  toggleHelp(event: Event): void {
    event.stopPropagation();
    this.showHelp = !this.showHelp;
    if (this.showHelp) {
      setTimeout(() => { this.showHelp = false; this.cdr.detectChanges(); }, 5000);
    }
  }

  onSearch() {
    if (!this.searchTerm.trim()) { this.searchResults = []; return; }
    this.searchResults = this.places.filter(p => p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  seleccionarDesdeBuscador(place: DatosMapa) {
    this.searchTerm = ''; this.searchResults = [];
    const marker = this.markers.find(m => m.getLatLng().lat === place.coords.lat && m.getLatLng().lng === place.coords.lng);
    if (marker) this.seleccionarLugar(place, marker);
  }
  CrearMarcadorPersonalizado() {
    this.errorMsg = '';
    if (!this.nuevoMarcador.nome|| this.nuevoMarcador.nome.trim().length === 0) {
      this.errorMsg = 'O nome do marcador é obrigatorio para poder gardalo.';
      return;
    }



    const body = {
      nome: this.frontUserService.capitalizarNombre(this.nuevoMarcador.nome),
      descripcion: this.nuevoMarcador.descripcion || '',
      tipo: 'personalizado',
      icono: 'star',
      coords: this.nuevoMarcador.coords
    };



    if (this.idMarcadorEditando) {
      this.mapaService.actualizarMarcador(this.idMarcadorEditando, body).subscribe({
        next: (res) => {
          const index = this.places.findIndex(p => p.id === this.idMarcadorEditando);

          if (index !== -1) {
            this.places[index] = res;
          }

          this.finalizarAccion();
        }
      });
    } else {
      // --- MODO CREAR ---
      this.mapaService.guardarMarcador(body).subscribe({
        next: (res) => {
          this.places.push(res);
          this.finalizarAccion();
        },
        error:(res) =>{
          this.errorMsg = 'Falta el nombre por cubrir';
        }
      });
    }
  }
  private finalizarAccion() {
    this.renderMarkers(); // Dibuja todo de cero (limpiando capas si usas LayerGroup)
    this.cerrarFormulario();
    this.idMarcadorEditando = null;
    this.textoBotonForm = 'Gardar';
    this.selectedPlace = null; // Cerramos la card de info por si el ID cambió
    this.cdr.detectChanges();
  }

  abrirFormulario() {
    this.mostrarFormularioMarcadores = true;
    this.textoBotonForm = 'Gardar';
    this.errorMsg = '';
    this.nuevoMarcador.nome = ''; this.nuevoMarcador.descripcion = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.initMiniMap(); }, 100);
  }

  private initMiniMap() {
    if (this.mapPick) { this.mapPick.remove(); }
    this.mapPick = L.map('mapPick', {
      center: this.centroGalicia,
      zoom: 8,
      minZoom: 7,
      maxBounds: this.boundsGalicia,
      maxBoundsViscosity: 1.0
    });
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { attribution: 'Google' }).addTo(this.mapPick);
    this.pickMarker = L.marker(this.centroGalicia, { draggable: true, autoPan: true, icon: this.getCustomIcon('personalizado', 'star', 12) }).addTo(this.mapPick);
    setTimeout(() => { if (this.mapPick) { this.mapPick.invalidateSize(); } }, 450);
    this.mapPick.on('click', (e: L.LeafletMouseEvent) => { this.actualizarPosicion(e.latlng); });
    this.pickMarker.on('dragend', () => { if (this.pickMarker) { this.actualizarPosicion(this.pickMarker.getLatLng()); } });
  }

  private actualizarPosicion(latlng: L.LatLng) {
    this.zone.run(() => {
      if (this.pickMarker) { this.pickMarker.setLatLng(latlng); }
      this.nuevoMarcador.coords.lat = latlng.lat;
      this.nuevoMarcador.coords.lng = latlng.lng;
      if (this.mapPick) { this.mapPick.panTo(latlng); }
      this.cdr.detectChanges();
    });
  }

  cerrarFormulario() {
    this.mostrarFormularioMarcadores = false;
    if (this.mapPick) { this.mapPick.remove(); (this.mapPick as any) = null; }
    this.pickMarker = null;
    this.cdr.detectChanges();
  }


  public idMarcadorEditando: number | string | null = null;

  abrirParaEditar(place: DatosMapa) {
    // Guardamos el ID por si luego en tu guardarMarcador tienes que hacer un PUT/UPDATE en vez de POST
    this.idMarcadorEditando = place.id || null;
    this.textoBotonForm = 'Actualizar';

    // Copiamos los datos del marcador seleccionado al modelo del formulario
    this.nuevoMarcador = {
      nome: place.nome,
      descripcion: place.descripcion || '',
      tipo: place.tipo,
      icono: place.icono,
      coords: {
        lat: place.coords.lat,
        lng: place.coords.lng
      }
    };

    this.mostrarFormularioMarcadores = true;
    this.cdr.detectChanges();

    // Iniciamos el minimapa centrado en las coordenadas de este marcador
    setTimeout(() => {
      this.initMiniMap();
      // Movemos el mapa pequeño y el pin a la posición del marcador que estamos editando
      if (this.mapPick && this.pickMarker) {
        const latlng = L.latLng(place.coords.lat, place.coords.lng);
        this.pickMarker.setLatLng(latlng);
        this.mapPick.setView(latlng, 14);
      }
    }, 100);
  }

  public toastConfig = {
    visible: false,
    mensaje: '',
    icon: 'priority_high',
    txtConfirmar: 'ELIMINAR',
    accion: () => { } // Aquí guardaremos la función que queremos ejecutar
  };


  borrarMarcador(place: any) {
    this.toastConfig = {
      visible: true,
      mensaje: `¿Estás seguro de que queres eliminar "${place.nome}"? Esta acción non se puede desfacer.`,
      icon: 'delete_forever',
      txtConfirmar: 'SÍ, ELIMINAR',
      accion: () => {
        // Esta es la lógica real de borrado que se ejecutará al confirmar
        this.mapaService.borrarMarcador(place.id).subscribe({
          next: () => {
            this.places = this.places.filter(p => p.id !== place.id);
            this.renderMarkers();
            this.selectedPlace = null;
            this.cerrarToast();
          },
          error: (err) => console.error(err)
        });
      }
    };
    this.cdr.detectChanges();
  }

  // Funciones de control del Toast
  ejecutarAccionToast() {
    this.toastConfig.accion(); // Ejecuta lo que guardamos arriba
  }

  cerrarToast() {
    this.toastConfig.visible = false;
    this.cdr.detectChanges();
  }

public recargarMapa() {
  // Cerramos todos los posibles formularios abiertos
  this.mostrarFormularioMarcadores = false;
  this.mostrarFormLugar = false;

  // Llamamos a cargarDatos que ya tienes definido
  // Este método hace el subscribe y luego llama a renderMarkers()
  this.cargarDatos();

  // Forzamos la detección de cambios por si acaso
  this.cdr.detectChanges();
}
}
