import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detalles-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-general.html',
  styleUrl: './detalles-general.css',
})
export class DetallesGeneral {
@Input() isOpen: boolean = false;
  @Input() item: any = null;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }

  get tituloPrincipal(): string {
    if (!this.item) return '';
    return this.item.nombre || this.item.titulo || 'Detalle do rexistro';
  }

  get propiedadesDinamicas(): { clave: string, valor: any }[] {
    if (!this.item) return [];

    // Añadimos 'icono' a la lista negra para que no se pinte como texto
    const clavesOcultas = ['id', 'nombre', 'titulo', 'tipo', 'imagenUrl', 'enlaceExterno', 'icono'];

    return Object.keys(this.item)
      // Filtramos nulos, vacíos y arrays que vengan sin datos (length === 0)
      .filter(key => !clavesOcultas.includes(key) && this.item[key] !== null && this.item[key] !== '' && this.item[key]?.length !== 0)
      .map(key => ({
        clave: this.formatearClave(key),
        valor: this.procesarValor(key, this.item[key]) // 👈 Pasamos el valor por el "filtro inteligente"
      }));
  }

  // --- EL FILTRO INTELIGENTE ---
  private procesarValor(clave: string, valor: any): any {

    // 1. Si son coordenadas, las ponemos bonitas
    if (clave === 'coords' || clave === 'coordenadas') {
      let c = valor;
      // Si la base de datos lo manda como un String de JSON, lo convertimos a objeto
      if (typeof c === 'string') {
         try { c = JSON.parse(c); } catch(e) {}
      }
      if (c && c.lat !== undefined && c.lng !== undefined) {
        return `Lat: ${Number(c.lat).toFixed(5)}, Lng: ${Number(c.lng).toFixed(5)}`;
      }
    }

    // 2. Si es una lista (Bailes, cancions, Eventos, etc.)
    if (Array.isArray(valor)) {
      return valor.map(item => {
        // Si el elemento de la lista es un objeto, extraemos solo su nombre
        if (typeof item === 'object' && item !== null) {
          return item.nome || item.nombre || item.titulo || 'Elemento sen nome';
        }
        return item; // Por si acaso ya venía como texto simple
      });
    }

    // 3. Si es un objeto suelto (que no sea array ni coords), intentamos sacar su nombre
    if (typeof valor === 'object' && valor !== null) {
       return valor.nome || valor.nombre || valor.titulo || JSON.stringify(valor);
    }

    // Si es un texto normal, lo devolvemos tal cual
    return valor;
  }

  private formatearClave(clave: string): string {
    const separada = clave.replace(/([A-Z])/g, ' $1').trim();
    return separada.charAt(0).toUpperCase() + separada.slice(1);
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }
}
