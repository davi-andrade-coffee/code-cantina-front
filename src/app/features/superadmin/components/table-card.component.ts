import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'superadmin-table-card',
  template: `
    <section class="rounded-xl border border-base-100 bg-base-200 p-4">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-base font-semibold">{{ title }}</h2>
          <p *ngIf="subtitle" class="text-xs opacity-70">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
          <ng-content select="[table-actions]"></ng-content>
        </div>
      </div>
      <ng-content></ng-content>
    </section>
  `,
})
export class TableCardComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}
