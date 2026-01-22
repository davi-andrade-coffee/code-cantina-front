import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client.page').then(m => m.ClientPage),
  },
];

