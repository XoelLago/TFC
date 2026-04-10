import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrontUserService } from '../../service/front-user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {

  // 1. INICIALIZACIÓN SEGURA: No nos fiamos del localStorage para el ID
  usuario: any = {
    id: null,
    nombre: localStorage.getItem('user_nombre') || '', // Solo para carga visual rápida
    rol: localStorage.getItem('user_rol') || '',
  };

  usuarioEditado: any = { nombre: '' };
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';

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

        // 2. LA VERDAD ABSOLUTA: Viene del servidor
        this.usuario = res;

        // Aseguramos el ID por si acaso Nest lo devuelve de forma extraña
        this.usuario.id = res.id;
        this.usuarioEditado.nombre = res.nombre;

        // Actualizamos persistencia visual (Opcional, pero útil para menús)
        if (res.rol) localStorage.setItem('user_rol', res.rol);
        if (res.nombre) localStorage.setItem('user_nombre', res.nombre);
        // Ya NO guardamos ni leemos el ID en el localStorage.

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.cargando = false;
        this.onLogout(); // Si el token es inválido o caducó, expulsamos al usuario
      }
    });
  }

  cambiarSeccion(nuevaSeccion: string) {
    this.seccionActual = nuevaSeccion;
    this.errorMsg = '';
    if (nuevaSeccion === 'cuenta') {
      this.usuarioEditado.nombre = this.usuario.nombre;
    }
  }

  volver() {
    this.seccionActual = 'principal';
  }

  actualizarNombre() {
    // 1. Validación básica de entrada
    if (!this.usuarioEditado.nombre || this.usuarioEditado.nombre.trim().length < 3) {
      this.errorMsg = 'El nombre debe tener al menos 3 caracteres';
      return;
    }

    // 2. Verificación de ID ESTRICTA
    if (!this.usuario || !this.usuario.id) {
      this.errorMsg = 'Error: Esperando validación del servidor. Intenta de nuevo.';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    // Forzamos el estado inicial de carga en la vista
    this.cdr.detectChanges();

    this.frontUserService.updateUsuario(this.usuario.id, { nombre: this.usuarioEditado.nombre }).subscribe({
      next: (res: any) => {
        // Actualizamos los datos
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);

        this.cargando = false;
        this.volver();

        // ¡ESTO ES CLAVE! Avisamos a Angular de que ya no estamos cargando
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;

        if (err.error && err.error.message) {
          this.errorMsg = Array.isArray(err.error.message)
            ? err.error.message[0]
            : err.error.message;
        } else {
          this.errorMsg = 'Error inesperado al actualizar el nombre';
        }

        console.error('Error al actualizar nombre:', err);

        // También avisamos aquí para desbloquear el botón en caso de fallo
        this.cdr.detectChanges();
      }
    });
  }

  onLogout() {
    this.frontUserService.logout();
  }
}
