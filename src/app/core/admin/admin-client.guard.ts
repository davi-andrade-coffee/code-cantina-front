import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminClientService } from './admin-client.service';

export const adminClientGuard: CanMatchFn = () => {
  const router = inject(Router);
  const adminClient = inject(AdminClientService);

  const selected = adminClient.getSelectedClient();
  if (adminClient.isClientActive(selected)) return true;

  if (selected && !adminClient.isClientActive(selected)) {
    adminClient.clearSelectedClient();
  }

  router.navigateByUrl('/admin/selecionar-cliente');
  return false;
};
