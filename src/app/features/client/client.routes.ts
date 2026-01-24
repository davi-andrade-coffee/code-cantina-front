import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'finance',
        loadComponent: () => import('./pages/finance/finance.page').then(m => m.FinancePage),
      },
      {
        path: 'statement',
        loadComponent: () =>
          import('./pages/statement/statement.page').then(m => m.StatementPage),
      },
    ],
  },
];
