import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

// Modelos e Interfaces
import { Usuario, UsuarioMapeado } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';

// Servicios y Componentes
import { FrontUserService } from '../../service/front-user.service';
import { EventosService } from '../../service/eventos.service';
import { AdminUsersComponent } from '../../components/admin-users/admin-users';
import { ActionToastComponent } from "../../components/action-toast/action-toast";
import { FormEvento } from '../../components/form-evento/form-evento';
import { DetallesGeneral } from "../../components/detalles-general/detalles-general";

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, AdminUsersComponent, ActionToastComponent, FormEvento, DetallesGeneral],
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {

  // Usuario principal tipado
  usuario: Usuario = {
    id: 0,
    nombre: localStorage.getItem('user_nombre') || '',
    rol: (localStorage.getItem('user_rol') as Rol),
  };

  // Estado de edición
  usuarioEditado = { nome: '', contrasena: '' };
  showPassword = false;

  // Estado de la UI
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';

  // ADMIN USUARIOS
  usuariosMapeados: UsuarioMapeado[] = [];

  // ADMIN SOLICITUDES
  solicitudes: any[] = [];
  solicitudSeleccionada: any = null;
  eventoDeSolicitud: any = null;
  terminoBusqueda: string = '';
  filtroEstado: 'TODOS' | 'PENDIENTE' | 'APROBADA' = 'TODOS';

  // Sistema de confirmación / Toast
  confirmacion = {
    visible: false,
    mensaje: '',
    tipo: '',
    id: null as number | null
  };

  modalDetalleAbierto: boolean = false;
  eventoDeSolicitudFormateado: any = null;

  constructor(
    private frontUserService: FrontUserService,
    private eventosService: EventosService,
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
        localStorage.setItem('user_rol', usuario.rol);
        localStorage.setItem('user_nombre', usuario.nombre);
        localStorage.setItem('user_id', String(usuario.id));
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

    if (nuevaSeccion === 'cuenta') {
      this.usuarioEditado.nome = this.usuario.nombre;
      this.usuarioEditado.contrasena = '';
    }
    if (nuevaSeccion === 'admin-usuarios') this.listarUsuarios();
    if (nuevaSeccion === 'admin-solicitudes') {
      this.terminoBusqueda = '';
      this.filtroEstado = 'TODOS';
      this.listarSolicitudes();
    }
  }

  volver(): void {
    this.seccionActual = 'principal';
    this.errorMsg = '';
  }

  // --- GESTIÓN DE CUENTA ---
  actualizarCuenta(): void {
    if (!this.usuarioEditado.nome || this.usuarioEditado.nome.trim().length < 3) {
      this.errorMsg = 'O nome debe ter polo menos 3 caracteres';
      return;
    }
    this.cargando = true;
    const body: any = { nombre: this.usuarioEditado.nome.toLowerCase() };
    if (this.usuarioEditado.contrasena) body.contrasena = this.usuarioEditado.contrasena;

    this.frontUserService.updateUsuario(this.usuario.id, body).subscribe({
      next: (res: any) => {
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);
        this.usuarioEditado.contrasena = '';
        this.cargando = false;
        this.mostrarToastExito('¡Cambios gardados con éxito!');
        this.volver();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Erro ao actualizar';
        this.cdr.detectChanges();
      }
    });
  }

  onLogout(): void {
    this.frontUserService.logout();
    this.router.navigate(['/login']);
  }

  // --- ADMINISTRACIÓN DE USUARIOS ---
  listarUsuarios(): void {
    this.cargando = true;
    this.frontUserService.getUsuarios().subscribe({
      next: (res: Usuario[]) => {
        this.usuariosMapeados = res.map(u => ({
          id: u.id,
          titulo: u.nombre,
          etiqueta: u.rol.toUpperCase(),
          claseCss: u.rol.toLowerCase(),
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

  manejarAccionUsuario(evento: { tipo: string, item: UsuarioMapeado }): void {
    const user = evento.item.original;
    const tipoAccion = evento.tipo.toLowerCase().trim();

    if (tipoAccion === 'ascender' && user.rol === 'ADMIN') {
      this.mostrarToastExito(`O usuario ${user.nombre} xa é Administrador.`);
      return;
    }

    if (tipoAccion === 'descender' && user.rol === 'USER') {
      this.mostrarToastExito(`O usuario ${user.nombre} xa ten o rango mínimo.`);
      return;
    }

    const mensajes: Record<string, string> = {
      'ascender': `¿Desexas ascender a ${user.nombre} a Administrador?`,
      'descender': `¿Desexas quitar os privilexios a ${user.nombre}?`,
      'eliminar': `¿Eliminar permanentemente a ${user.nombre}?`
    };

    this.pedirConfirmacion(mensajes[tipoAccion] || '¿Confirmar acción?', tipoAccion, user.id);
  }

  private ejecutarAccionUsuario(tipo: string, id: number): void {
    this.cargando = true;
    this.errorMsg = '';

    let peticion;
    if (tipo === 'ascender') peticion = this.frontUserService.ascenderUsuario(id);
    else if (tipo === 'descender') peticion = this.frontUserService.descenderUsuario(id);
    else peticion = this.frontUserService.eliminarUsuario(id);

    peticion.subscribe({
      next: () => {
        this.mostrarToastExito(`Operación completada con éxito.`);
        this.listarUsuarios();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Erro na operación';
        this.cdr.detectChanges();
      }
    });
  }

  // --- ADMINISTRACIÓN DE SOLICITUDES ---
  listarSolicitudes(): void {
    this.cargando = true;
    forkJoin({
      solicitudes: this.eventosService.obtenerSolicitudes(),
      eventos: this.eventosService.findAll() // Necesitas este método
    }).subscribe({
      next: (res: any) => {
        this.solicitudes = res.solicitudes.map((sol: any) => ({
          ...sol,
          evento: res.eventos.find((e: any) => e.id === sol.eventoId)
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  obtenerSolicitudesFiltradas() {
    return this.solicitudes.filter(sol => {
      const coincideEstado = this.filtroEstado === 'TODOS' || sol.estado === this.filtroEstado;
      const nombreEvento = (sol.evento?.nome || sol.evento?.nombre || '').toLowerCase();
      const asociacionEvento = (sol.evento?.asociacion || '').toLowerCase();
      const busqueda = this.terminoBusqueda.toLowerCase();

      const coincideBusqueda = nombreEvento.includes(busqueda) || asociacionEvento.includes(busqueda);
      return coincideEstado && coincideBusqueda;
    });
  }



  // Preparadores de confirmación para solicitudes (vinculados al HTML)
  prepararAceptar(sol: any): void {
    const nombre = sol.evento?.nome || sol.evento?.nombre || 'este evento';
    this.pedirConfirmacion(`¿Aprobar e publicar ${nombre}?`, 'aceptar-solicitud', sol.id);
  }

  prepararRechazar(sol: any): void {
    const nombre = sol.evento?.nome || sol.evento?.nombre || 'este evento';
    this.pedirConfirmacion(`¿Rechazar a solicitude para ${nombre}?`, 'rechazar-solicitud', sol.id);
  }

  prepararEliminarSol(sol: any): void {
    this.pedirConfirmacion(`¿Eliminar esta solicitude permanentemente?`, 'eliminar-solicitud', sol.id);
  }

  // Ejecutores reales tras confirmar
  private ejecutarAceptarSolicitud(solId: number): void {
    this.cargando = true;
    const sol = this.solicitudes.find(s => s.id === solId);

    if (!sol) {
      this.cargando = false;
      return;
    }

    this.eventosService.actualizarSolicitud(solId, { estado: 'APROBADA' }).pipe(
      switchMap(() => this.eventosService.actualizarEvento(sol.eventoId, { publicado: true }))
    ).subscribe({
      next: () => {
        this.mostrarToastExito('Solicitude aprobada e evento publicado.');
        this.listarSolicitudes();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private ejecutarEliminarSolicitud(solId: number, esRechazo: boolean = false): void {
    this.cargando = true;
    const solicitud = this.solicitudes.find(s => s.id === solId);

    if (!solicitud || !solicitud.eventoId) {
      this.cargando = false;
      return;
    }

    // Usamos switchMap para encadenar: primero borra evento, luego solicitud
    this.eventosService.eliminarSolicitud(solId).pipe(
      switchMap(() => this.eventosService.eliminarEvento(solicitud.eventoId))
    ).subscribe({
      next: () => {
        this.mostrarToastExito(esRechazo ? 'Solicitude rechazada.' : 'Solicitude eliminada.');
        this.listarSolicitudes();
      },
      error: (err) => {
        console.error('Error en cadena de borrado:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- NUEVO SISTEMA DE TOAST / CONFIRMACIÓN ---

  // Para mensajes de éxito (Sin botones, cierre automático)
  private mostrarToastExito(msg: string): void {
    this.confirmacion = { visible: true, mensaje: msg, tipo: 'info', id: null };
    this.cdr.detectChanges();

    // Se cierra solo tras 2 segundos (2000 ms)
    setTimeout(() => {
      if (this.confirmacion.visible && this.confirmacion.tipo === 'info') {
        this.cancelarConfirmacion();
      }
    }, 2000);
  }

  // Para acciones que requieren confirmación (Con botones SI/NO)
  private pedirConfirmacion(msg: string, tipo: string, id: number): void {
    this.confirmacion = { visible: true, mensaje: msg, tipo: tipo, id: id };
    this.cdr.detectChanges();
  }

  confirmarAccionApp(): void {
    const { tipo, id } = this.confirmacion;
    this.cancelarConfirmacion();

    if (id === null) return;

    if (tipo === 'aceptar-solicitud') {
      this.ejecutarAceptarSolicitud(id);
    }
    else if (tipo === 'rechazar-solicitud') {
      this.ejecutarEliminarSolicitud(id, true);
    }
    else if (tipo === 'eliminar-solicitud') {
      this.ejecutarEliminarSolicitud(id, false);
    }
    else {
      this.ejecutarAccionUsuario(tipo, id);
    }
  }

  cancelarConfirmacion(): void {
    this.confirmacion.visible = false;
    this.cdr.detectChanges();
  }

  verDetalleSolicitud(sol: any): void {
  this.cargando = true;
  this.solicitudSeleccionada = sol;

  // Usamos el evento que ya tienes en la solicitud (ya viene con asociaciones del listarSolicitudes)
  const evento = sol.evento;

  if (evento) {
    const nombreAsociacion = (evento.asociaciones && evento.asociaciones.length > 0)
      ? evento.asociaciones[0].nome
      : 'Non especificada';

    this.eventoDeSolicitudFormateado = {
      nombre: evento.nome || evento.nombre || 'Solicitude de Evento',
      tipo: 'SOLICITUDE DE EVENTO',
      estado: sol.estado,
      organización: nombreAsociacion,
      fecha: evento.fecha ? new Date(evento.fecha).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }) : 'Sen fecha',
      ubicación: evento.lugar?.nome || 'A Coruña, Desconocida',
      descripción: evento.descripcion
    };
  } else {
    // Si por alguna razón sol.evento no existe, mantenemos el fallback
    this.eventoDeSolicitudFormateado = {
      nombre: 'Error ao cargar',
      tipo: 'SOLICITUDE DE EVENTO',
      estado: sol.estado,
      organización: 'Non especificada'
    };
  }

  this.modalDetalleAbierto = true;
  this.cargando = false;
  this.cdr.detectChanges();
}

  // --- AÑADE ESTE MÉTODO PARA CERRAR EL MODAL ---
  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.eventoDeSolicitudFormateado = null;
    this.solicitudSeleccionada = null;
  }
}
