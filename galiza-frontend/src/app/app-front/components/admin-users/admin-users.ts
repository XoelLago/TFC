import { Component, Input, OnInit, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit, OnChanges {
  @Input() items: any[] = [];
  @Input() cargando: boolean = false;
  @Input() miRol: string = '';
  @Input() miId: number | null = null; // <--- Nuevo: Para saber quién eres tú
  @Input() tituloLista: string = 'GESTIÓN';

  @Output() accionRealizada = new EventEmitter<{tipo: string, item: any}>();

  itemsFiltrados: any[] = [];
  filtroActual: string = 'todos';
  terminoBusqueda: string = '';
  itemSeleccionado: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.itemsFiltrados = [...this.items];
  }

  ngOnChanges() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.items];
    if (this.filtroActual !== 'todos') {
      resultado = resultado.filter(i => i.claseCss?.toLowerCase() === this.filtroActual);
    }
    if (this.terminoBusqueda.trim()) {
      const search = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(i =>
        i.titulo?.toLowerCase().includes(search) ||
        i.subtitulo?.toLowerCase().includes(search)
      );
    }
    this.itemsFiltrados = resultado;
    this.cdr.detectChanges();
  }

  setFiltro(val: string) {
    this.filtroActual = val;
    this.aplicarFiltros();
  }

  seleccionarItem(item: any) {
    this.itemSeleccionado = item;
  }

  cerrarCard() {
    this.itemSeleccionado = null;
  }

  emitirAccion(tipo: string) {
    this.accionRealizada.emit({ tipo, item: this.itemSeleccionado });
    this.cerrarCard();
  }
}
