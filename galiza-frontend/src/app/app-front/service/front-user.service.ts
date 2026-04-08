import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontUserService {
  private URL_API = 'http://localhost:3000';

  // Inicializamos el Subject con lo que haya en disco
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private getUserFromStorage() {
    const rol = localStorage.getItem('user_rol');
    const nombre = localStorage.getItem('user_nombre');
    // Si existen ambos, devolvemos el objeto, si no, null
    return (rol && nombre) ? { rol, nombre } : null;
  }

  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.URL_API}/usuarios`, usuario);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/auth/login`, credenciales).pipe(
      tap(res => {
        if (res.access_token && res.user) {
          // 1. GUARDAR EN LOCALSTORAGE (Para persistencia al refrescar F5)
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('user_rol', res.user.rol);
          localStorage.setItem('user_nombre', res.user.nombre);

          // 2. ACTUALIZAR EL SUBJECT (Para reactividad instantánea sin recargar)
          const userData = {
            rol: res.user.rol,
            nombre: res.user.nombre
          };
          this.userSubject.next(userData);
        }
      })
    );
  }

  logout() {
    // Limpiamos todo
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('user_nombre');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Helper para obtener el token rápido en otras peticiones
  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPerfil() {
    return this.http.get(`${this.URL_API}/auth/profile`, { headers: this.getHeaders() });
  }

  // Modificado para que si el usuario actualiza su propio nombre,
  // la interfaz se entere al momento
  updateUsuario(id: string, datos: any) {
    return this.http.patch(`${this.URL_API}/usuarios/${id}`, datos, { headers: this.getHeaders() }).pipe(
      tap((usuarioActualizado: any) => {
        // Si el usuario cambió su nombre, actualizamos el storage y el subject
        if (datos.nombre) {
          localStorage.setItem('user_nombre', usuarioActualizado.nombre);
          this.userSubject.next({
            ...this.userSubject.value,
            nombre: usuarioActualizado.nombre
          });
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
