import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FrontUserService } from '../../service/front-user.service';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RouterLink],
  templateUrl: './registro-page.html',
  styleUrls: ['./registro-page.css'] // Puedes importar aquí el mismo CSS del login si quieres
})
export class RegistroPage {
  usuario = {
    nombre: '',
    contrasena: '',
  };
  loading = false;
  errorMsg = '';

  constructor(private frontUserService: FrontUserService, private router: Router, private cdr: ChangeDetectorRef) {}

  onRegistrar() {
    this.loading = true;
    this.errorMsg = '';
    this.frontUserService.registrar(this.usuario).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
         this.errorMsg = 'El usuario ya existe';
         console.error('Error en login:', err);

        this.cdr.detectChanges();
      }
    });
  }
}
