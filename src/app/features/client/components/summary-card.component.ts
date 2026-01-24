import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'client-summary-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs uppercase opacity-70">{{ title }}</div>
            <div class="text-xl font-semibold">{{ value }}</div>
            <div *ngIf="subtitle" class="text-sm opacity-70 mt-1">{{ subtitle }}</div>
          </div>
          <span *ngIf="badge" class="badge badge-primary badge-sm">{{ badge }}</span>
        </div>
        <div *ngIf="note" class="text-xs opacity-70 mt-3">{{ note }}</div>
        <div class="mt-3">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class SummaryCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() subtitle?: string;
  @Input() badge?: string;
  @Input() note?: string;
}
