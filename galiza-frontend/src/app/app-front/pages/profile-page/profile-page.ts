import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  // 1. Cargamos el rol desde el localStorage al empezar para que el botón aparezca ya
  usuario: any = {
    nombre: localStorage.getItem('user_nombre') || '',
    rol: localStorage.getItem('user_rol') || '',
    _id: ''
  };

  usuarioEditado: any = { nombre: '' };
  seccionActual: string = 'principal';
  cargando: boolean = false;
  errorMsg: string = '';
  nombreDeRespaldo: string = localStorage.getItem('user_nombre') || 'Usuario';

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
        // 2. Actualizamos el objeto con lo que venga del servidor
        this.usuario = res;
        this.usuarioEditado.nombre = res.nombre;

        // Guardamos el rol por si ha cambiado
        if (res.rol) {
          localStorage.setItem('user_rol', res.rol);
        }

        console.log('ROL DETECTADO:', this.usuario.rol); // Mira esto en la consola (F12)

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.cargando = false;
        // Si falla el token, fuera
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
    this.cargando = true;
    this.frontUserService.updateUsuario(this.usuario._id, { nombre: this.usuarioEditado.nombre }).subscribe({
      next: (res: any) => {
        this.usuario.nombre = res.nombre;
        localStorage.setItem('user_nombre', res.nombre);
        this.cargando = false;
        this.volver();
      },
      error: () => this.cargando = false
    });
  }

  onLogout() {
    this.frontUserService.logout();
  }
}
