import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean | UrlTree {
    // Verificamos si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {

      // CAMBIO CLAVE: Ahora buscamos 'access_token'
      const token = localStorage.getItem('access_token');

      if (token) {
        return true; // Hay token, ¡pasa al Home!
      }

      // No hay token, te mando al login
      return this.router.parseUrl('/login');
    }

    // Si es el servidor (SSR), dejamos pasar para que el navegador decida luego
    return true;
  }
}
