import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TipoRecomendacion } from '../../models/enums';
import { Recomendacion } from '../../models/recomendacion.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecomendacionesService } from '../../service/recomendaciones.service';
import { DetallesGeneral } from '../../components/detalles-general/detalles-general';
import { FormRecomendacion } from '../../components/form-recomendacion/form-recomendacion';
// 👇 Importamos el nuevo formulario

@Component({
  selector: 'app-recomendacion-page',
  standalone: true,
  imports: [FormsModule, CommonModule, DetallesGeneral, FormRecomendacion],
  templateUrl: './recomendacion-page.html',
  styleUrl: './recomendacion-page.css',
})
export class RecomendacionPage implements OnInit {
  textoBusqueda: string = '';
  filtroActivo: string = 'TODOS';
  recomendaciones: Recomendacion[] = [];

  modalAbierto: boolean = false;
  itemSeleccionado: any = null;

  // 👇 CONTROLES PARA EL FORMULARIO Y ROLES
  formAbierto: boolean = false;
  esAdminOSuper: boolean = false; // Guardará si tiene permisos

  filtros = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'LIBROS', value: TipoRecomendacion.LIBRO },
    { label: 'MÚSICA', value: TipoRecomendacion.CANCION },
    { label: 'DOCUMENTALES', value: TipoRecomendacion.DOCUMENTAL },
    { label: 'ARTISTAS', value: TipoRecomendacion.ARTISTA }
  ];

  constructor(
    private recomendacionService: RecomendacionesService,
    private cdr: ChangeDetectorRef
    // private authService: AuthService // 👈 Descomenta si usas un servicio de Auth
  ) {}

  ngOnInit() {
    this.cargarRecomendaciones();
    this.verificarPermisos();
  }

  verificarPermisos() {
  const rol = localStorage.getItem('user_rol') || ''; // Cambia 'rol' por el nombre de tu variable
  this.esAdminOSuper = ['ADMIN', 'SUPERUSER', 'SUPERADMIN'].includes(rol.toUpperCase());
}
  cargarRecomendaciones() {
    this.recomendacionService.findAll().subscribe({
      next: (data) => {
        this.recomendaciones = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar recomendaciones:', err)
    });
  }

  get recomendacionesFiltradas() {
    if (!this.recomendaciones) return [];
    return this.recomendaciones.filter(rec => {
      const cumpleTipo = this.filtroActivo === 'TODOS' || rec.tipo === this.filtroActivo;
      const termino = this.textoBusqueda.toLowerCase();
      const cumpleTexto = !termino ||
                          rec.titulo.toLowerCase().includes(termino) ||
                          rec.autor.toLowerCase().includes(termino) ||
                          (rec.resumo && rec.resumo.toLowerCase().includes(termino));
      return cumpleTipo && cumpleTexto;
    });
  }

  setFiltro(valor: string) {
    this.filtroActivo = valor;
    this.cdr.detectChanges();
  }

  abrirDetalle(rec: Recomendacion) {
    this.itemSeleccionado = rec;
    this.modalAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarDetalle() {
    this.modalAbierto = false;
    this.itemSeleccionado = null;
    this.cdr.detectChanges();
  }

  // 👇 MÉTODOS DEL FORMULARIO
  abrirFormulario() {
    this.formAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarFormulario() {
    this.formAbierto = false;
    this.cdr.detectChanges();
  }

  guardarNuevaRecomendacion(datos: any) {
    // CORRECCIÓN: Usamos crearRecomendacion que es el método real de tu servicio
    this.recomendacionService.crearRecomendacion(datos).subscribe({
      next: () => {
        this.cargarRecomendaciones();
        this.cerrarFormulario();
      },
      error: (err) => console.error('Error al crear recomendación:', err)
    });
  }
}
