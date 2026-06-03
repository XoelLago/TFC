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
  showPassword = false;

  constructor(
    private frontUserService: FrontUserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.frontUserService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
  if (this.loading) return;

  this.loading = true;
  this.errorMsg = '';

  this.frontUserService.login(this.credenciales).subscribe({
    next: (res) => {
      this.loading = false;
      this.router.navigate(['/home']);
    },
    error: (err) => {
      this.loading = false;
      this.errorMsg = 'Usuario ou contrasinal incorrectos';

      this.cdr.detectChanges();
    }
  });
}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    this.frontUserService.logout();
    this.router.navigate(['/login']);
  }
}
