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

  usuario: any = {
    id: null, // Cambiado de _id a id
    nombre: localStorage.getItem('user_nombre') || '',
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
        // En MySQL el ID viene como 'id'
        this.usuario = res;
        this.usuarioEditado.nombre = res.nombre;

        // Actualizamos persistencia por si acaso
        if (res.rol) localStorage.setItem('user_rol', res.rol);
        if (res.id) localStorage.setItem('user_id', res.id.toString());

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.cargando = false;
        this.onLogout();
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
    if (!this.usuarioEditado.nombre) return;

    // Validamos que tenemos el ID antes de enviar
    if (!this.usuario.id) {
      this.errorMsg = 'Error: ID de usuario no encontrado';
      return;
    }

    this.cargando = true;
    this.frontUserService.updateUsuario(this.usuario.id, { nombre: this.usuarioEditado.nombre }).subscribe({
      next: (res: any) => {
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);
        this.cargando = false;
        this.volver();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = 'No se pudo actualizar el nombre';
      }
    });
  }

  onLogout() {
    this.frontUserService.logout();
  }
}
