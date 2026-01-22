import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./collaborator.page').then(m => m.CollaboratorPage),
  },
];

