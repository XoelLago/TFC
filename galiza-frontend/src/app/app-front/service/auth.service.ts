import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Verificamos si estamos en el navegador
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(nombre: string, contrasena: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        if (nombre && contrasena) {
          if (this.isBrowser) {
            localStorage.setItem('token', 'fake-token-123');
          }
          observer.next({ token: 'fake-token-123' });
        } else {
          observer.error('Campos vacíos');
        }
        observer.complete();
      }, 500);
    });
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('token');
    }
    return false; // Si es el servidor, decimos que no está logueado por seguridad
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }
}
