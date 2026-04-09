import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FrontUserService } from '../../service/front-user.service';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-page.html',
  styleUrls: ['./registro-page.css']
})
export class RegistroPage {
  usuario = {
    nombre: '',
    contrasena: '',
  };

  loading = false;
  errorMsg = '';
  showPassword = false; // Para el ojito de la contraseña

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onRegistrar() {
    // 1. Validación inicial
    if (!this.usuario.nombre || !this.usuario.contrasena) {
      this.errorMsg = 'Debes rellenar todos los campos';
      return;
    }

    this.loading = true;
    this.errorMsg = ''; // Limpiamos errores previos

    this.frontUserService.registrar(this.usuario).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;

        // Manejo de errores dinámico según lo que responda NestJS/MySQL
        if (err.status === 409 || err.status === 400) {
          this.errorMsg = 'El nombre de usuario ya está registrado';
        } else {
          this.errorMsg = 'Error en el servidor. Inténtalo más tarde';
        }

        console.error('Error en registro:', err);
        this.cdr.detectChanges();
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
