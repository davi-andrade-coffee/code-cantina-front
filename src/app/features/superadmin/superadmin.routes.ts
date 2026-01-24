import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./superadmin-layout/superadmin-layout.component').then(
        (m) => m.SuperadminLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'admins' },
      {
        path: 'admins',
        loadComponent: () =>
          import('./pages/admins-list/component').then((m) => m.AdminsListPage),
      },
      {
        path: 'admins/:adminId',
        loadComponent: () =>
          import('./pages/admin-detail/component').then((m) => m.AdminDetailPage),
      },
      {
        path: 'stores',
        loadComponent: () =>
          import('./pages/stores-list/component').then((m) => m.StoresListPage),
      },
      {
        path: 'billing/invoices',
        loadComponent: () =>
          import('./pages/invoices-list/component').then((m) => m.InvoicesListPage),
      },
      {
        path: 'billing/overview',
        loadComponent: () =>
          import('./pages/billing-overview/component').then((m) => m.BillingOverviewPage),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./pages/logs/component').then((m) => m.SuperadminLogsPage),
      },
    ],
  },
];
