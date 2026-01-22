import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage),
      },
    ],
  },
  {
    path: 'superadmin',
    canMatch: [authGuard, roleGuard(['SUPERADMIN'])],
    loadChildren: () => import('./features/superadmin/superadmin.routes').then(m => m.routes),
  },
  {
    path: 'admin',
    canMatch: [authGuard, roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
  },
  {
    path: 'collaborator',
    canMatch: [authGuard, roleGuard(['COLABORADOR'])],
    loadChildren: () => import('./features/collaborator/collaborator.routes').then(m => m.routes),
  },
  {
    path: 'client',
    canMatch: [authGuard, roleGuard(['CLIENTE'])],
    loadChildren: () => import('./features/client/client.routes').then(m => m.routes),
  },

  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' },
];

