import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'superadmin-kpi-card',
  template: `
    <div class="rounded-xl border border-base-100 bg-base-200 p-4">
      <div class="text-xs uppercase tracking-wide opacity-60">{{ label }}</div>
      <div class="mt-2 text-2xl font-semibold">{{ value }}</div>
      <div *ngIf="hint" class="mt-1 text-xs opacity-60">{{ hint }}</div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() hint?: string;
}
