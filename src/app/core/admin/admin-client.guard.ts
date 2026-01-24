import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminClientService } from './admin-client.service';

export const adminClientGuard: CanMatchFn = () => {
  const router = inject(Router);
  const adminClient = inject(AdminClientService);

  if (adminClient.getSelectedClient()) return true;

  router.navigateByUrl('/admin/selecionar-cliente');
  return false;
};
