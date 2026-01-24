import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../pdv/pdv.routes').then(m => m.routes),
  },
];
