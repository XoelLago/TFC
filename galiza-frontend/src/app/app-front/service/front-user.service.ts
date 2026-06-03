import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FrontUserService {
  private URL_API = environment.apiUrl;

    private loginStatus = new BehaviorSubject<boolean>(this.hasToken());


  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private getUserFromStorage() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

esAdmin(): boolean {
  const user = this.userSubject.value;
  if (!user?.rol) return false;

  const rol = user.rol.toLowerCase();
  return rol === 'admin' || rol === 'superuser';
}

esSuperuser(): boolean {
  const user = this.userSubject.value;
  return user?.rol?.toLowerCase() === 'superuser';
}

  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.URL_API}/usuarios`, usuario);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/auth/login`, credenciales).pipe(
      tap(res => {
        if (res.access_token && res.user) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('user', JSON.stringify(res.user));
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('user_nombre');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }


  getPerfil() {
    return this.http.get(`${this.URL_API}/auth/profile`);
  }

  updateUsuario(id: number, datos: any) {
    return this.http.patch(`${this.URL_API}/usuarios/${id}`, datos).pipe(
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

getUsuarios(): Observable<any[]> {
  return this.http.get<any[]>(`${this.URL_API}/usuarios`);
}

ascenderUsuario(id: number): Observable<any> {
  return this.http.patch(`${this.URL_API}/usuarios/${id}/ascender`, {});
}

descenderUsuario(id: number): Observable<any> {
  return this.http.patch(`${this.URL_API}/usuarios/${id}/descender`, {});
}

eliminarUsuario(id: number): Observable<any> {
  return this.http.delete(`${this.URL_API}/usuarios/${id}`);
}

 capitalizarNombre(texto: string): string {
  if (!texto) return '';
  return texto.trim().charAt(0).toUpperCase() + texto.trim().slice(1).toLowerCase();
}

hasToken(): boolean {
    return !!localStorage.getItem('token');
  }


notificarLogin() {
  this.loginStatus.next(true);
}

getLoginStatus() {
  return this.loginStatus.asObservable();
}

}
