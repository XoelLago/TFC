import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrontUserService } from '../../service/front-user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { AdminUsersComponent } from '../../components/admin-users/admin-users';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, AdminUsersComponent],
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {

  usuario: any = {
    id: null,
    nombre: localStorage.getItem('user_nombre') || '',
    rol: localStorage.getItem('user_rol') || '',
  };

  usuarioEditado: Usuario = { nome: '' };
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';
  usuariosMapeados: any[] = [];

  // --- ESTADO PARA EL TOAST ---
  confirmacion = {
    visible: false,
    mensaje: '',
    tipo: '',
    id: null as number | null
  };

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerDatosPerfil();
  }

  obtenerDatosPerfil() {
    this.cargando = true;
    this.frontUserService.getPerfil().subscribe({
      next: (res: any) => {
        this.usuario = res;
        this.usuario.id = res.id;
        this.usuarioEditado.nome = res.nombre;
        if (res.rol) localStorage.setItem('user_rol', res.rol);
        if (res.nombre) localStorage.setItem('user_nombre', res.nombre);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.onLogout();
      }
    });
  }

  cambiarSeccion(nuevaSeccion: string) {
    this.seccionActual = nuevaSeccion;
    this.errorMsg = '';
    if (nuevaSeccion === 'cuenta') this.usuarioEditado.nome = this.usuario.nombre;
    if (nuevaSeccion === 'admin-usuarios') this.listarUsuarios();
  }

  volver() { this.seccionActual = 'principal'; }

  actualizarNombre() {
    if (!this.usuarioEditado.nome || this.usuarioEditado.nome.trim().length < 3) {
      this.errorMsg = 'El nombre debe tener al menos 3 caracteres';
      return;
    }
    this.cargando = true;
    this.frontUserService.updateUsuario(this.usuario.id, { nombre: this.usuarioEditado.nome }).subscribe({
      next: (res: any) => {
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);
        this.cargando = false;
        this.volver();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error';
        this.cdr.detectChanges();
      }
    });
  }

  onLogout() { this.frontUserService.logout(); }

  listarUsuarios() {
    this.cargando = true;
    this.frontUserService.getUsuarios().subscribe({
      next: (res: any[]) => {
        this.usuariosMapeados = res.map(u => ({
          id: u.id,
          titulo: u.nombre,
          etiqueta: u.rol,
          claseCss: u.rol?.toLowerCase(),
          original: u
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

manejarAccionUsuario(evento: { tipo: string, item: any }) {
  const user = evento.item.original; // Usuario que viene de la lista
  const accionOriginal = evento.tipo.toLowerCase().trim();

  // 1. Normalización para que coincida con NestJS
  let tipoAccion = '';
  if (accionOriginal.includes('ascen')) tipoAccion = 'ascender';
  else if (accionOriginal.includes('descen')) tipoAccion = 'descender';
  else if (accionOriginal.includes('eliminar')) tipoAccion = 'eliminar';

  // 2. VALIDACIÓN DE RANGO MÁXIMO (Ascender)
  // Si ya es ADMIN, bloqueamos el ascenso a SUPERUSER desde el front
  if (tipoAccion === 'ascender' && user.rol?.toUpperCase() === 'ADMIN') {
    this.confirmacion = {
      visible: true,
      mensaje: `El usuario ${user.nombre} ya es Administrador. No puedes ascenderlo más desde aquí.`,
      tipo: 'cancelar', // No ejecutará nada
      id: null
    };
    this.cdr.detectChanges();
    return;
  }

  // 3. VALIDACIÓN DE RANGO MÍNIMO (Descender)
  // Si ya es USER, bloqueamos que se intente descender más
  if (tipoAccion === 'descender' && user.rol?.toUpperCase() === 'USER') {
    this.confirmacion = {
      visible: true,
      mensaje: `El usuario ${user.nombre} ya tiene el rango mínimo (Usuario).`,
      tipo: 'cancelar',
      id: null
    };
    this.cdr.detectChanges();
    return;
  }

  // 4. PREPARACIÓN DE MENSAJES PARA ACCIONES VÁLIDAS
  const mensajes: { [key: string]: string } = {
    'ascender': `¿Deseas ascender a ${user.nombre} a Administrador?`,
    'descender': `¿Deseas quitar los privilegios de Administrador a ${user.nombre}?`,
    'eliminar': `¿Eliminar permanentemente a ${user.nombre}?`
  };

  this.confirmacion = {
    visible: true,
    mensaje: mensajes[tipoAccion] || '¿Confirmar acción?',
    tipo: tipoAccion,
    id: user.id
  };

  this.cdr.detectChanges();
}

confirmarAccionApp() {
  // Si el id es null o el tipo es cancelar, solo cerramos
  if (!this.confirmacion.id || this.confirmacion.tipo === 'cancelar') {
    this.cancelarConfirmacion();
    return;
  }

  const { tipo, id } = this.confirmacion;
  this.cancelarConfirmacion();
  this.ejecutarAccion(tipo, id);
}

  cancelarConfirmacion() {
    this.confirmacion.visible = false;
    this.cdr.detectChanges();
  }

private ejecutarAccion(tipo: string, id: number) {
  this.cargando = true;
  this.errorMsg = '';
  this.cdr.detectChanges();

  // Mapeo exacto a los métodos de tu FrontUserService que llaman a NestJS
  let peticion;
  if (tipo === 'ascender') peticion = this.frontUserService.ascenderUsuario(id);
  else if (tipo === 'descender') peticion = this.frontUserService.descenderUsuario(id);
  else peticion = this.frontUserService.eliminarUsuario(id);

  peticion.subscribe({
    next: () => {
      this.listarUsuarios(); // Recarga la lista desde el backend
    },
    error: (err: any) => {
      this.cargando = false;
      // Capturamos el BadRequestException de NestJS (ej: "Ya tiene el rango mínimo")
      this.errorMsg = err.error?.message || 'Error al procesar la acción';
      this.cdr.detectChanges();
    }
  });
}
}
