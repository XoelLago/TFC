import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos pillar el token del almacenamiento local
  const token = localStorage.getItem('access_token');

  // 2. Si hay token, clonamos la petición y le metemos el header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 3. Si no hay token, la petición sigue su curso normal
  return next(req);
};
