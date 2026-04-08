import { CommonModule } from "@angular/common";
import { Component, ChangeDetectorRef, OnInit } from "@angular/core"; // 1. Añadimos ChangeDetectorRef
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

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef // 2. Inyectamos el detector de cambios
  ) {}

  ngOnInit() {
    if (this.frontUserService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    this.loading = true;
    this.errorMsg = '';

    this.frontUserService.login(this.credenciales).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/home']);
        // No hace falta forzar cambios aquí porque la navegación ya lo hace
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Usuario o contraseña incorrectos';
        console.error('Error en login:', err);

        // 3. ¡ESTO ES LO IMPORTANTE!
        // Forzamos a Angular a que actualice la vista (el @if) ahora mismo.
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.frontUserService.logout();
    this.router.navigate(['/login']);
  }
}
