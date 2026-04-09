import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { FrontUserService } from '../app-front/service/front-user.service';

// role.guard.ts
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private FrontUserService: FrontUserService, private router: Router) {}

  canActivate(): boolean {
    if (this.FrontUserService.esAdmin()) {
      return true; // Es admin, puede pasar
    }

    this.router.navigate(['/mapa']); // No es admin, lo mandamos al mapa
    return false;
  }
}
