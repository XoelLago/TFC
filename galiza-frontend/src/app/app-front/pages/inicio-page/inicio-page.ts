import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-page.html',
  styleUrls: ['./inicio-page.css']
})
export class InicioPage {

  nombre = '';
  contrasena = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']); // si ya hay token
    }
  }

  onLogin() {

  this.authService.login(this.nombre, this.contrasena).subscribe({
    next: (res) => {
      console.log('Login exitoso, token guardado:', localStorage.getItem('token'));
      this.router.navigate(['/home']).then(nav => {
        console.log('¿Navegación exitosa?:', nav);
      });
    },
    error: (err) => console.error('Error en login:', err)
  });
}
  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}

