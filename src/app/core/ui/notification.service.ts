import { Injectable, signal } from '@angular/core';

export type NotificationLevel = 'success' | 'error' | 'info' | 'loading';

export interface ToastNotification {
  id: number;
  level: NotificationLevel;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly sequence = signal(0);
  private readonly queueState = signal<ToastNotification[]>([]);

  readonly queue = this.queueState.asReadonly();

  success(message: string, durationMs = 3000): number {
    return this.push('success', message, durationMs);
  }

  error(message: string, durationMs = 5000): number {
    return this.push('error', message, durationMs);
  }

  info(message: string, durationMs = 3500): number {
    return this.push('info', message, durationMs);
  }

  loading(message: string): number {
    return this.push('loading', message);
  }

  dismiss(id: number): void {
    this.queueState.update((notifications) => notifications.filter((item) => item.id !== id));
  }

  private push(level: NotificationLevel, message: string, durationMs?: number): number {
    const id = this.sequence() + 1;
    this.sequence.set(id);

    this.queueState.update((notifications) => [...notifications, { id, level, message }]);

    if (typeof durationMs === 'number' && durationMs > 0) {
      window.setTimeout(() => this.dismiss(id), durationMs);
    }

    return id;
  }
}
