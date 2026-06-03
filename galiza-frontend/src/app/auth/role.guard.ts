import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { FrontUserService } from '../app-front/service/front-user.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private FrontUserService: FrontUserService, private router: Router) {}

  canActivate(): boolean {
    if (this.FrontUserService.esAdmin()) {
      return true;
    }

    this.router.navigate(['/mapa']);
    return false;
  }
}
