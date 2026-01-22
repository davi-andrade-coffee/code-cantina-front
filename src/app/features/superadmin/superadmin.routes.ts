import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./superadmin.page').then(m => m.SuperAdminPage),
  },
];

