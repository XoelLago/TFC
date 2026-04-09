import { CommonModule } from "@angular/common";
import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { FrontUserService } from "../../service/front-user.service";

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio-page.html',
  styleUrls: ['./inicio-page.css']
})
export class InicioPage implements OnInit {
  credenciales = {
    nombre: '',
    contrasena: ''
  };

  errorMsg = '';
  loading = false;
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit() {
    // Si ya está logueado, lo mandamos al home directamente
    if (this.frontUserService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
  if (this.loading) return; // Evita múltiples clics si ya está cargando

  this.loading = true;
  this.errorMsg = '';

  this.frontUserService.login(this.credenciales).subscribe({
    next: (res) => {
      this.loading = false;
      // Navegamos directamente. El FrontUserService ya se encargó de guardar token y user.
      this.router.navigate(['/home']);
    },
    error: (err) => {
      this.loading = false;
      this.errorMsg = 'Usuario o contraseña incorrectos';

      // Aseguramos que el mensaje de error se muestre inmediatamente
      this.cdr.detectChanges();
    }
  });
}

  // Función para alternar ver/ocultar contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    this.frontUserService.logout();
    this.router.navigate(['/login']);
  }
}
