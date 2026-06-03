import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');
    if (!token || !userJson) {
      return this.router.parseUrl('/login');
    }

try {
  const user = JSON.parse(userJson);
  const userRol = user.rol?.toLowerCase();

  if (route.data['role']) {
    const roleRequerido = route.data['role'].toLowerCase();

    if (userRol !== roleRequerido && userRol !== 'superuser') {
      return this.router.parseUrl('/home');
    }
  }
} catch (e) {
  localStorage.clear();
  return this.router.parseUrl('/login');
}

    return true;
  }
  return true;
}
}
