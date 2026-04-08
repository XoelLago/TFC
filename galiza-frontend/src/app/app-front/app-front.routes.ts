import { Routes } from "@angular/router";
import { InicioPage } from "./pages/inicio-page/inicio-page";
import { HomePage } from "./pages/home-page/home-page";
import { BusquedaPage } from "./pages/busqueda-page/busqueda-page";
import { RecomendacionPage } from "./pages/recomendacion-page/recomendacion-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";
import { AuthGuard } from "../auth/auth.guard";
import { RegistroPage } from "./pages/registro-page/registro-page";
import { ProfilePage } from "./pages/profile-page/profile-page";

export const appFrontRoutes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: InicioPage
  },
  {
  path: 'registro',
  component: RegistroPage
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
