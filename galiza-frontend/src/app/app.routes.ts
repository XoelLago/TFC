import { Routes } from '@angular/router';

export const routes: Routes = [

   {
    path: '',
    loadChildren: () => import('./app-front/app-front.routes').then(m => m.default)
   }
];
