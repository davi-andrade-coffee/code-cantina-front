import { CanMatchFn, Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Role } from './roles';

export function roleGuard(allowed: Role[]): CanMatchFn {
  return (route: Route) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getRole();
    if (!auth.isAuthenticated() || !role) {
      router.navigateByUrl('/auth/login');
      return false;
    }

    if (allowed.includes(role)) return true;

    router.navigateByUrl('/auth/login');
    return false;
  };
}

