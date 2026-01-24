import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pdv-shell.page').then(m => m.PdvShellPage),
  },
];
