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
  private map!: L.Map;
  private oldMapLayer!: L.TileLayer.WMS;
  private markers: L.Marker[] = [];

  public showHelp: boolean = false;
  public searchTerm: string = '';
  public searchResults: DatosMapa[] = [];

  // Datos locales (hasta que conectemos el API)
  public places: DatosMapa[] = MAP_DATA;
  public selectedPlace: DatosMapa | null = null;

  opacity: number = 0;
  private lastMarker: L.Marker | null = null;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private mapaService: MapaService
  ) { }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // 1. Inicializar el contenedor del mapa
    this.map = L.map('map', {
      center: [42.755, -7.863],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: L.latLngBounds(L.latLng(42.0, -10.0), L.latLng(43.0, -5.0)),
    });

    // 2. CAPA BASE: RELIEVE OCEÁNICO
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 13
    }).addTo(this.map);

    // 3. CAPA SATÉLITE: PNOA
    L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
      layers: 'OI.OrthoimageCoverage',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      opacity: 1,
      zIndex: 5
    }).addTo(this.map);

    // 4. CAPA HISTÓRICA: MINUTAS
    this.oldMapLayer = L.tileLayer.wms('https://www.ign.es/wms/minutas-cartograficas', {
      layers: 'Minutas',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      opacity: this.opacity,
      zIndex: 10
    }).addTo(this.map);

    this.renderMarkers();

    this.map.on('zoomend', () => {
      this.updateMarkersSize();
    });

    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      mapDiv.style.backgroundColor = '#abd3df';
    }
  }

  private renderMarkers() {
    this.places.forEach(place => {
      // Leaflet acepta {lat, lng} directamente
      const marker = L.marker(place.coords, {
        icon: this.getCustomIcon(place.tipo, place.icono, this.map.getZoom())
      }).addTo(this.map);

      marker.bindTooltip(`<b>${place.nome}</b>`, { direction: 'top', offset: [0, -45] });

      marker.on('click', () => {
        this.seleccionarLugar(place, marker);
      });

      this.markers.push(marker);
    });
  }

  // Función auxiliar para centrar y seleccionar
  private seleccionarLugar(place: DatosMapa, marker: L.Marker) {
    this.zone.run(() => {
      if (this.lastMarker) this.lastMarker.setZIndexOffset(0);
      this.selectedPlace = place;
      marker.setZIndexOffset(1000);
      this.lastMarker = marker;

      // Cálculo de desplazamiento para que el popup no tape el marcador
      const targetPoint = this.map.project(place.coords, 10).subtract([0, 120]);
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
        if (currentZoom < 7.5) {
          element.style.display = 'none';
        } else {
          element.style.display = 'block';
          marker.setIcon(this.getCustomIcon(place.tipo, place.icono, currentZoom));
        }
      }
    });
  }

  getCustomIcon(tipo: string, iconName: string, zoom: number) {
    const size = Math.max(40, zoom * 4);
    const fontSize = size * 0.55;

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
    if (this.oldMapLayer) this.oldMapLayer.setOpacity(this.opacity);
  }

  toggleHelp(event: Event): void {
    event.stopPropagation();
    this.showHelp = !this.showHelp;
    if (this.showHelp) {
      setTimeout(() => {
        this.showHelp = false;
        this.cdr.detectChanges();
      }, 5000);
    }
  }

  onSearch() {
    this.mapaService.buscarLugares(this.searchTerm).subscribe(res => {
      this.searchResults = res;
    });
  }

  seleccionarDesdeBuscador(place: DatosMapa) {
    this.searchTerm = '';
    this.searchResults = [];

    // Buscamos el marcador por coordenadas de objeto
    const marker = this.markers.find(m =>
      m.getLatLng().lat === place.coords.lat &&
      m.getLatLng().lng === place.coords.lng
    );

    if (marker) {
      this.seleccionarLugar(place, marker);
    }
  }
}
