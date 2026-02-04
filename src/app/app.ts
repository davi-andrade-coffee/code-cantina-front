import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalUiEventsService } from './core/ui/global-ui-events.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class App {
  private readonly events = inject(GlobalUiEventsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly sessionExpiredOpen = signal(false);
  readonly forbiddenOpen = signal(false);

  constructor() {
    this.events.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        if (e.type === 'SESSION_EXPIRED') {
          if (!this.sessionExpiredOpen()) this.sessionExpiredOpen.set(true);
        }

        if (e.type === 'FORBIDDEN') {
          if (!this.forbiddenOpen()) this.forbiddenOpen.set(true);
        }
      });
  }

  onSessionExpiredConfirm(): void {
    this.sessionExpiredOpen.set(false);
    this.router.navigate(['/auth/login']);
  }

  onForbiddenClose(): void {
    this.forbiddenOpen.set(false);
    this.router.navigate(['/auth/login']);
  }
}

