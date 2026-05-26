import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { FrontUserService } from '../../service/front-user.service';
import { EventosService } from '../../service/eventos.service';
import { AdminUsersComponent } from '../../components/admin-users/admin-users';
import { ActionToastComponent } from "../../components/action-toast/action-toast";
import { FormEvento } from '../../components/form-evento/form-evento';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, AdminUsersComponent, ActionToastComponent, FormEvento],
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {

  // ESTADO UI
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';
  showPassword = false;

  // DATOS USUARIO
  usuario = { id: 0, nombre: '', rol: '' };
  usuarioEditado = { nome: '', contrasena: '' };

  // ADMIN SOLICITUDES
  solicitudes: any[] = [];
  solicitudSeleccionada: any = null;
  eventoDeSolicitud: any = null;
  usuariosMapeados: any[] = [];

  confirmacion = { visible: false, mensaje: '', tipo: 'info', id: null as number | null };

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
      next: (res: any) => {
        this.usuario = res;
        this.usuarioEditado.nome = res.nombre;
        localStorage.setItem('user_rol', res.rol);
        localStorage.setItem('user_nombre', res.nombre);
        localStorage.setItem('user_id', res.id);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.onLogout()
    });
  }

  cambiarSeccion(nuevaSeccion: string): void {
    this.seccionActual = nuevaSeccion;
    this.errorMsg = '';
    if (nuevaSeccion === 'admin-usuarios') this.listarUsuarios();
    if (nuevaSeccion === 'admin-solicitudes') this.listarSolicitudes();
  }

  volver(): void {
    this.seccionActual = 'principal';
    this.errorMsg = '';
  }

  // --- GESTIÓN DE CUENTA (FUSIONADO) ---
  actualizarCuenta(): void {
    if (!this.usuarioEditado.nome || this.usuarioEditado.nome.trim().length < 3) {
      this.errorMsg = 'El nombre debe tener al menos 3 caracteres';
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
        this.mostrarToastInformativo('¡Cambios guardados!');
        this.volver();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error al actualizar';
        this.cdr.detectChanges();
      }
    });
  }

  // --- ADMINISTRACIÓN DE SOLICITUDES ---
  listarSolicitudes(): void {
    this.cargando = true;
    this.eventosService.obtenerSolicitudes().subscribe({
      next: (res) => {
        this.solicitudes = res;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  verDetalleSolicitud(sol: any): void {
    this.cargando = true;
    this.solicitudSeleccionada = sol;
    this.eventosService.obtenerEventoPorId(sol.eventoId).subscribe({
      next: (evento) => {
        this.eventoDeSolicitud = evento;
        this.seccionActual = 'ver-solicitud';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  resolverSolicitud(aprobar: boolean): void {
    this.cargando = true;
    const estado = aprobar ? 'ACEPTADA' : 'RECHAZADA';
    this.eventosService.actualizarSolicitud(this.solicitudSeleccionada.id, { estado }).pipe(
      switchMap(() => aprobar ? this.eventosService.actualizarEvento(this.eventoDeSolicitud.id, { publicado: true }) : of(null))
    ).subscribe({
      next: () => {
        this.cargando = false;
        this.cambiarSeccion('admin-solicitudes');
      },
      error: () => this.cargando = false
    });
  }

  // --- OTROS MÉTODOS ---
  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  mostrarToastInformativo(msg: string) {
    this.confirmacion = { visible: true, mensaje: msg, tipo: 'info', id: null };
    this.cdr.detectChanges();
  }

  listarUsuarios(): void {
    this.cargando = true;
    this.frontUserService.getUsuarios().subscribe({
      next: (res: any[]) => {
        this.usuariosMapeados = res.map(u => ({ id: u.id, titulo: u.nombre, etiqueta: u.rol, claseCss: u.rol.toLowerCase(), original: u }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  manejarAccionUsuario(evento: any): void {
    // Lógica de ascender/descender ya existente...
  }

  cancelarConfirmacion() { this.confirmacion.visible = false; }
  confirmarAccionApp() { this.cancelarConfirmacion(); }
}
