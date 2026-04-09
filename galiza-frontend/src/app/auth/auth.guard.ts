import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // En auth.guard.ts
canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('access_token'); // Asegúrate que la clave sea 'token'
    const userJson = localStorage.getItem('user'); // Aquí debe estar el objeto completo

    if (!token || !userJson) {
      return this.router.parseUrl('/login');
    }

    try {
      const user = JSON.parse(userJson);

      if (route.data['role'] && route.data['role'] !== user.rol) {
        return this.router.parseUrl('/home');
      }
    } catch (e) {
      // Si el JSON está mal, limpiamos y fuera
      localStorage.clear();
      return this.router.parseUrl('/login');
    }

    return true;
  }
  return true;
}
}
