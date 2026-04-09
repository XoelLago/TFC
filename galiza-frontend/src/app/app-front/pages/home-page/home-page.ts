import { Component, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { DatosMapa, MAP_DATA } from '../../service/datos.data';
import { MapaService } from '../../service/mapa.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements AfterViewInit {
  // Referencias de Leaflet
  private map!: L.Map;
  private oldMapLayer!: L.TileLayer.WMS;
  private markers: L.Marker[] = [];

  // Estado de la interfaz
  public showHelp: boolean = false;
  public searchTerm: string = '';
  public searchResults: DatosMapa[] = [];
  public selectedPlace: DatosMapa | null = null;
  public opacity: number = 0;

  // Datos y control de marcadores
  public places: DatosMapa[] = MAP_DATA;
  private lastMarker: L.Marker | null = null;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private mapaService: MapaService
  ) { }

  ngAfterViewInit() {
    // Timeout para asegurar que el contenedor #map existe en el DOM
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap(): void {
    // 1. Configuración inicial del mapa centrado en Galicia
    this.map = L.map('map', {
      center: [42.755, -7.863],
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      // Limitamos el movimiento a la zona de Galicia
      maxBounds: L.latLngBounds(L.latLng(41.5, -10.0), L.latLng(44.0, -6.0)),
    });

    // 2. CAPA BASE: Océanos/Relieve (ESRI)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 13,
      attribution: 'Tiles &copy; Esri'
    }).addTo(this.map);

    // 3. CAPA SATÉLITE: PNOA (IGN España)
    L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
      layers: 'OI.OrthoimageCoverage',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      zIndex: 5
    }).addTo(this.map);

    // 4. CAPA HISTÓRICA: Minutas Cartográficas (IGN)
    // Es la capa que controlamos con el slider de opacidad
    this.oldMapLayer = L.tileLayer.wms('https://www.ign.es/wms/minutas-cartograficas', {
      layers: 'Minutas',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      opacity: this.opacity,
      zIndex: 10
    }).addTo(this.map);

    // Dibujar los puntos iniciales
    this.renderMarkers();

    // Evento para redimensionar iconos según el zoom
    this.map.on('zoomend', () => {
      this.updateMarkersSize();
    });

    // Color de fondo para zonas sin carga (mar)
    const mapDiv = document.getElementById('map');
    if (mapDiv) mapDiv.style.backgroundColor = '#abd3df';
  }

  private renderMarkers() {
    this.places.forEach(place => {
      const marker = L.marker(place.coords, {
        icon: this.getCustomIcon(place.tipo, place.icono, this.map.getZoom())
      }).addTo(this.map);

      // Tooltip rápido al pasar el ratón
      marker.bindTooltip(`<b>${place.nome}</b>`, {
        direction: 'top',
        offset: [0, -35]
      });

      // Evento de clic en marcador
      marker.on('click', () => {
        this.seleccionarLugar(place, marker);
      });

      this.markers.push(marker);
    });
  }

  public seleccionarLugar(place: DatosMapa, marker: L.Marker) {
    // zone.run asegura que Angular detecte los cambios de variables dentro de eventos de Leaflet
    this.zone.run(() => {
      if (this.lastMarker) {
        this.lastMarker.setZIndexOffset(0);
      }

      this.selectedPlace = place;
      marker.setZIndexOffset(1000); // Ponemos el marcador encima de todos
      this.lastMarker = marker;

      // Desplazamos el mapa un poco para que la card no tape el marcador
      const targetPoint = this.map.project(place.coords, 10).subtract([0, 150]);
      this.map.flyTo(this.map.unproject(targetPoint, 10), 10);

      this.cdr.detectChanges();
    });
  }

  private updateMarkersSize() {
    const currentZoom = this.map.getZoom();
    this.markers.forEach((marker, index) => {
      const place = this.places[index];
      const element = marker.getElement();

      if (element) {
        // Ocultamos marcadores si el zoom es muy lejano
        if (currentZoom < 7.5) {
          element.style.display = 'none';
        } else {
          element.style.display = 'block';
          marker.setIcon(this.getCustomIcon(place.tipo, place.icono, currentZoom));
        }
      }
    });
  }

  private getCustomIcon(tipo: string, iconName: string, zoom: number) {
    // El tamaño escala con el zoom
    const size = Math.max(35, zoom * 3.5);
    const fontSize = size * 0.5;

    // Colores corporativos por tipo
    let color = '#6c757d';
    if (tipo === 'asociacion') color = '#D4A017';
    else if (tipo === 'evento') color = '#8C2A1C';
    else if (tipo === 'lugar') color = '#B34A32';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin marker-${tipo}" style="width:${size}px; height:${size}px;">
               <span class="material-icons" style="font-size:${fontSize}px; color: ${color};">${iconName}</span>
             </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size]
    });
  }

  updateOpacity() {
    if (this.oldMapLayer) {
      this.oldMapLayer.setOpacity(this.opacity);
    }
  }

  toggleHelp(event: Event): void {
    event.stopPropagation();
    this.showHelp = !this.showHelp;

    // Auto-cierre del globo de ayuda a los 5 segundos
    if (this.showHelp) {
      setTimeout(() => {
        this.showHelp = false;
        this.cdr.detectChanges();
      }, 5000);
    }
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    // Buscamos en el servicio (datos estáticos o API)
    this.mapaService.buscarLugares(this.searchTerm).subscribe(res => {
      this.searchResults = res;
      this.cdr.detectChanges();
    });
  }

  seleccionarDesdeBuscador(place: DatosMapa) {
    this.searchTerm = '';
    this.searchResults = [];

    // Localizamos el objeto marker de Leaflet que corresponde a este lugar
    const marker = this.markers.find(m => {
      const latLng = m.getLatLng();
      return latLng.lat === place.coords.lat && latLng.lng === place.coords.lng;
    });

    if (marker) {
      this.seleccionarLugar(place, marker);
    }
  }
}
