import { Routes } from "@angular/router";
import { InicioPage } from "./pages/inicio-page/inicio-page";
import { ProfilePage } from "./pages/profile-page/profile-page";
import { HomePage } from "./pages/home-page/home-page";
import { BusquedaPage } from "./pages/busqueda-page/busqueda-page";
import { RecomendacionPage } from "./pages/recomendacion-page/recomendacion-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";
import { AuthGuard } from "../auth/auth.guard";

export const appFrontRoutes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'login',
    component: InicioPage
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'busqueda',
    component: BusquedaPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'recomendacion',
    component: RecomendacionPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    component: NotFoundPage
    ,canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];

export default appFrontRoutes;
