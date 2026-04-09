import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontUserService {
  private URL_API = 'http://localhost:3000';

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private getUserFromStorage() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  esAdmin(): boolean {
    const user = this.userSubject.value;
    // Comparamos con el string exacto de tu Enum de NestJS
    return user?.rol === 'admin';
  }

  registrar(usuario: any): Observable<any> {
    // En NestJS, la ruta por defecto suele ser /api/usuarios si usaste el prefijo
    return this.http.post(`${this.URL_API}/usuarios`, usuario);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/auth/login`, credenciales).pipe(
      tap(res => {
        if (res.access_token && res.user) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('user', JSON.stringify(res.user)); // Guardamos el objeto entero
          const userData = {
            rol: res.user.rol,
            nombre: res.user.nombre,
            id: res.user.id
          };
          this.userSubject.next(userData);
        }
      })
    );
  }

  logout() {
    localStorage.clear(); // Más rápido: borra todo rastro
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPerfil() {
    return this.http.get(`${this.URL_API}/auth/profile`, { headers: this.getHeaders() });
  }

  // Cambiamos id: string por number para MySQL
  updateUsuario(id: number, datos: any) {
    return this.http.patch(`${this.URL_API}/usuarios/${id}`, datos, { headers: this.getHeaders() }).pipe(
      tap((usuarioActualizado: any) => {
        if (datos.nombre || datos.rol) {
          localStorage.setItem('user_nombre', usuarioActualizado.nombre);
          localStorage.setItem('user_rol', usuarioActualizado.rol);
          this.userSubject.next(usuarioActualizado);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  ascenderUsuario(id: number): Observable<any> {
  const url = `${this.URL_API}/usuarios/${id}/ascender`;
  // Enviamos un objeto vacío {} como body porque el cambio lo decide el backend
  return this.http.patch(url, {}, { headers: this.getHeaders() });
}
}
