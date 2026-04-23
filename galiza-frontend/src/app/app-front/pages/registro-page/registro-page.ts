import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FrontUserService } from '../../service/front-user.service';
import { ActionToastComponent } from "../../components/action-toast/action-toast";

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ActionToastComponent],
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

  mostrarToast: boolean = false;
  mensajeToast: string = '';

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

 onRegistrar() {
  // 1. Validación inicial (Frontend)
  if (!this.usuario.nombre || !this.usuario.contrasena) {
    this.errorMsg = 'Debes rellenar todos los campos';
    return;
  }

  this.loading = true;
  this.errorMsg = '';
this.usuario.nombre = this.usuario.nombre.toLowerCase();


  this.frontUserService.registrar(this.usuario).subscribe({
    next: () => {
      this.loading = false;
      // Opcional: Podrías pasar un mensaje al login de "Usuario creado con éxito"
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;

      /**
       * Captura de mensajes dinámicos:
       * err.error.message es donde NestJS guarda el texto que pusimos
       * en los "throw new ...Exception('Texto')" del Backend.
       */
      if (err.error && err.error.message) {
        // Si es un array (pasa cuando usas ValidationPipe con varias reglas)
        if (Array.isArray(err.error.message)) {
          this.errorMsg = err.error.message[0];
        } else {
          // Si es un string único (nuestros ConflictException o BadRequestException)
          this.errorMsg = err.error.message;
        }
      } else {
        // Fallback por si el servidor se cae o no responde el JSON esperado
        this.errorMsg = 'No se pudo conectar con el servidor';
      }

      console.error('Error detallado:', err);
      this.cdr.detectChanges();
    }
  });
}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
