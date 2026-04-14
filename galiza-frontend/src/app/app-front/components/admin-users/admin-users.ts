import { Component, Input, OnInit, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioMapeado } from '../../models/usuario.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit, OnChanges {
  @Input() items: UsuarioMapeado[] = [];
  @Input() cargando: boolean = false;
  @Input() miRol: string = '';
  @Input() miId: number | null = null;
  @Input() tituloLista: string = 'GESTIÓN';

  @Output() accionRealizada = new EventEmitter<{ tipo: string, item: UsuarioMapeado }>();

  itemsFiltrados: UsuarioMapeado[] = [];
  filtroActual: string = 'todos';
  terminoBusqueda: string = '';
  itemSeleccionado: UsuarioMapeado | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.aplicarFiltros(); }
  ngOnChanges() { this.aplicarFiltros(); }

  aplicarFiltros() {
    let resultado = [...this.items];
    if (this.filtroActual !== 'todos') {
      resultado = resultado.filter(i => i.claseCss === this.filtroActual.toLowerCase());
    }
    if (this.terminoBusqueda.trim()) {
      const search = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(i =>
        i.titulo.toLowerCase().includes(search)
      );
    }
    this.itemsFiltrados = resultado;
    this.cdr.detectChanges();
  }

  setFiltro(val: string) {
    this.filtroActual = val;
    this.aplicarFiltros();
  }

  seleccionarItem(item: UsuarioMapeado) { this.itemSeleccionado = item; }
  cerrarCard() { this.itemSeleccionado = null; }

  emitirAccion(tipo: string) {
    if (this.itemSeleccionado) {
      this.accionRealizada.emit({ tipo, item: this.itemSeleccionado });
      this.cerrarCard();
    }
  }
}
