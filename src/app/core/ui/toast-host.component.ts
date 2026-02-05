import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService, ToastNotification } from './notification.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast toast-top toast-end z-[1000]" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let notification of notificationService.queue()"
        class="alert shadow-lg"
        [ngClass]="alertClass(notification)"
      >
        <span class="text-sm">{{ notification.message }}</span>
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          (click)="notificationService.dismiss(notification.id)"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHostComponent {
  readonly notificationService = inject(NotificationService);

  alertClass(notification: ToastNotification): string {
    switch (notification.level) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'loading':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  }
}
