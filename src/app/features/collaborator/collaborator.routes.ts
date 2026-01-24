import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pdv',
  },
  {
    path: 'pdv',
    loadChildren: () => import('../pdv/pdv.routes').then(m => m.routes),
  },
];
