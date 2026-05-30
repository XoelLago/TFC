import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './busqueda-page.html',
  styleUrls: ['./busqueda-page.css']
})
export class BusquedaPage {
 mostrarAvanzados: boolean = false;

  filtrosDisponibles: string[] = [
    'Asociaciones', 'Bailes', 'Puntos', 'Lugares',
    'Canciones', 'Instrumento', 'Movimiento', 'Provincia'
  ];

  filtrosSeleccionados: string[] = ['Puntos'];

  busquedaAvanzada = {
    texto: '',
    provincia: '',
    localidad: ''
  };

  // BANCO DE DATOS HARDCODEADOS AMPLIADO
  resultados = [
    { tipo: 'PUNTO', nombre: 'Patada de picadillo', provincia: 'A Coruña', localidad: 'Santiago de Compostela' },
    { tipo: 'PUNTO', nombre: 'Punto cruzado de Rande', provincia: 'Pontevedra', localidad: 'Redondela' },
    { tipo: 'BAILE', nombre: 'Muiñeira de Chantada', provincia: 'Lugo', localidad: 'Chantada' },
    { tipo: 'BAILE', nombre: 'Xota de Vilabol de Suarna', provincia: 'Lugo', localidad: 'A Fonsagrada' },
    { tipo: 'ASOCIACIÓN', nombre: 'Cantigas e Agarimos', provincia: 'A Coruña', localidad: 'Santiago de Compostela' },
    { tipo: 'ASOCIACIÓN', nombre: 'Xerfa Tradición', provincia: 'Pontevedra', localidad: 'Moaña' },
    { tipo: 'LUGAR', nombre: 'Atrio de Santa María', provincia: 'Pontevedra', localidad: 'Pontevedra' },
    { tipo: 'LUGAR', nombre: 'Praza da Quintana', provincia: 'A Coruña', localidad: 'Santiago de Compostela' },
    { tipo: 'CANCIÓN', nombre: 'Alalá de Muxía', provincia: 'A Coruña', localidad: 'Muxía' },
    { tipo: 'CANCIÓN', nombre: 'Fandango de Solobeira', provincia: 'Pontevedra', localidad: 'Vilagarcía de Arousa' },
    { tipo: 'INSTRUMENTO', nombre: 'Gaita de fol tradicional en Do', provincia: 'Ourense', localidad: 'Ourense' },
    { tipo: 'INSTRUMENTO', nombre: 'Pandeireta Galega (vella)', provincia: 'A Coruña', localidad: 'Ribeira' },
    { tipo: 'MOVIMIENTO', nombre: 'Marcado de picado lateral', provincia: 'Pontevedra', localidad: 'Vigo' },
    { tipo: 'MOVIMIENTO', nombre: 'Salto de picada con xiro', provincia: 'Ourense', localidad: 'Allariz' },
    { tipo: 'PROVINCIA', nombre: 'A Coruña (Rías Altas)', provincia: 'A Coruña', localidad: '-' },
    { tipo: 'PROVINCIA', nombre: 'Pontevedra (Rías Baixas)', provincia: 'Pontevedra', localidad: '-' }
  ];

  toggleAvanzados() {
    this.mostrarAvanzados = !this.mostrarAvanzados;
  }

  toggleFiltro(filtro: string) {
    const index = this.filtrosSeleccionados.indexOf(filtro);
    if (index > -1) {
      this.filtrosSeleccionados.splice(index, 1);
    } else {
      this.filtrosSeleccionados.push(filtro);
    }
  }

  esFiltroActivo(filtro: string): boolean {
    return this.filtrosSeleccionados.includes(filtro);
  }
}
