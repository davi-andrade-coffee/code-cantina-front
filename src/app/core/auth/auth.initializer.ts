import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from './auth.service';

export function authInitFactory(auth: AuthService) {
  return async () => {
    if (!auth.isAuthenticated()) return;

    try {
      await auth.me();
    } catch {
      auth.logout();
    }
  };
}

export const AUTH_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: authInitFactory,
  deps: [AuthService],
  multi: true,
};

