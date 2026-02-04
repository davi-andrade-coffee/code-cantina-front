// http-error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { GlobalUiEventsService } from '../ui/global-ui-events.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const events = inject(GlobalUiEventsService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      if (err.status === 401) {
        auth.logout();
        events.emit({ type: 'SESSION_EXPIRED' });
      }

      if (err.status === 403) {
        auth.logout(); 
        events.emit({ type: 'FORBIDDEN' });
      }

      return throwError(() => err);
    })
  );
};

