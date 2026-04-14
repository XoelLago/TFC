import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Modelos e Interfaces
import { Usuario, UsuarioMapeado } from '../../models/usuario.model';

// Servicios y Componentes
import { FrontUserService } from '../../service/front-user.service';
import { AdminUsersComponent } from '../../components/admin-users/admin-users';
import { ActionToastComponent } from "../../components/action-toast/action-toast";
import { Rol } from '../../models/rol.model';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, AdminUsersComponent, ActionToastComponent],
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {

  // Usuario principal tipado (Datos del usuario logueado)
  usuario: Usuario = {
    id: 0,
    nombre: localStorage.getItem('user_nombre') || '',
    rol: (localStorage.getItem('user_rol') as Rol),
  };

  // Estado de edición
  usuarioEditado = { nome: '' };

  // Estado de la UI
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';

  // Lista de usuarios para el panel de administración
  usuariosMapeados: UsuarioMapeado[] = [];

  // Estado para el sistema de confirmación personalizado (Toast/Modal)
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

  obtenerDatosPerfil(): void {
    this.cargando = true;
    this.frontUserService.getPerfil().subscribe({
      next: (res) => {
        const usuario = res as Usuario;
        this.usuario = usuario;
        this.usuarioEditado.nome = usuario.nombre;
        // Sincronizamos Storage por si hubo cambios en el Back
        localStorage.setItem('user_rol', usuario.rol);
        localStorage.setItem('user_nombre', usuario.nombre);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.onLogout();
      }
    });
  }

  cambiarSeccion(nuevaSeccion: string): void {
    this.seccionActual = nuevaSeccion;
    this.errorMsg = '';
    if (nuevaSeccion === 'cuenta') this.usuarioEditado.nome = this.usuario.nombre;
    if (nuevaSeccion === 'admin-usuarios') this.listarUsuarios();
  }

  volver(): void {
    this.seccionActual = 'principal';
    this.errorMsg = '';
  }

  actualizarNombre(): void {
    if (!this.usuarioEditado.nome || this.usuarioEditado.nome.trim().length < 3) {
      this.errorMsg = 'El nombre debe tener al menos 3 caracteres';
      return;
    }
    this.cargando = true;
    this.frontUserService.updateUsuario(this.usuario.id, { nombre: this.usuarioEditado.nome }).subscribe({
      next: (res: Usuario) => {
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);
        this.cargando = false;
        this.volver();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error al actualizar';
        this.cdr.detectChanges();
      }
    });
  }

  onLogout(): void {
    this.frontUserService.logout();
    this.router.navigate(['/login']);
  }

  listarUsuarios(): void {
    this.cargando = true;
    this.frontUserService.getUsuarios().subscribe({
      next: (res: Usuario[]) => {
        // Mapeamos los datos reales a la estructura que entiende el componente visual
        this.usuariosMapeados = res.map(u => ({
          id: u.id,
          titulo: u.nombre,
          etiqueta: u.rol.toUpperCase(),
          claseCss: u.rol.toLowerCase(),
          original: u // Guardamos el objeto original para acciones posteriores
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

  manejarAccionUsuario(evento: { tipo: string, item: UsuarioMapeado }): void {
    const user = evento.item.original; // TS sabe que es tipo Usuario
    const tipoAccion = evento.tipo.toLowerCase().trim();

    // Validaciones de negocio antes de confirmar
    if (tipoAccion === 'ascender' && user.rol === 'ADMIN') {
      this.mostrarMensajeInformativo(`El usuario ${user.nombre} ya es Administrador.`);
      return;
    }

    if (tipoAccion === 'descender' && user.rol === 'USER') {
      this.mostrarMensajeInformativo(`El usuario ${user.nombre} ya tiene el rango mínimo.`);
      return;
    }

    // Preparar confirmación
    const mensajes: Record<string, string> = {
      'ascender': `¿Deseas ascender a ${user.nombre} a Administrador?`,
      'descender': `¿Deseas quitar los privilegios a ${user.nombre}?`,
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

  private mostrarMensajeInformativo(msg: string): void {
    this.confirmacion = { visible: true, mensaje: msg, tipo: 'cancelar', id: null };
    this.cdr.detectChanges();
  }

  confirmarAccionApp(): void {
    if (!this.confirmacion.id || this.confirmacion.tipo === 'cancelar') {
      this.cancelarConfirmacion();
      return;
    }

    const { tipo, id } = this.confirmacion;
    this.cancelarConfirmacion();
    this.ejecutarAccion(tipo, id);
  }

  cancelarConfirmacion(): void {
    this.confirmacion.visible = false;
    this.cdr.detectChanges();
  }

  private ejecutarAccion(tipo: string, id: number): void {
    this.cargando = true;
    this.errorMsg = '';

    let peticion;
    if (tipo === 'ascender') peticion = this.frontUserService.ascenderUsuario(id);
    else if (tipo === 'descender') peticion = this.frontUserService.descenderUsuario(id);
    else peticion = this.frontUserService.eliminarUsuario(id);

    peticion.subscribe({
      next: () => {
        this.listarUsuarios(); // Refrescar lista
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error en la operación';
        this.cdr.detectChanges();
      }
    });
  }
}
