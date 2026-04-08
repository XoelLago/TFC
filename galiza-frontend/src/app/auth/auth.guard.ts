import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos el ID de plataforma
  ) {}

  canActivate(): boolean | UrlTree {
    // 1. Verificamos si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return true;
      }
    } else {
      // 2. Si estamos en el servidor, dejamos pasar "falsamente"
      // para que el cliente lo verifique después.
      return true;
    }

    // 3. Si llega aquí es que está en el navegador y NO hay token
    return this.router.parseUrl('/login');
  }
}
