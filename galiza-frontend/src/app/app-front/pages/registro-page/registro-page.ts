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
  showPassword = false;

  mostrarToast: boolean = false;
  mensajeToast: string = '';

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

 onRegistrar() {
  if (!this.usuario.nombre || !this.usuario.contrasena) {
    this.errorMsg = 'Debes encher todos os campos';
    return;
  }

  this.loading = true;
  this.errorMsg = '';
this.usuario.nombre = this.usuario.nombre.toLowerCase();


  this.frontUserService.registrar(this.usuario).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;


      if (err.error && err.error.message) {
        if (Array.isArray(err.error.message)) {
          this.errorMsg = err.error.message[0];
        } else {
          this.errorMsg = err.error.message;
        }
      } else {
        this.errorMsg = 'Non se puido conectar co servidor';
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
