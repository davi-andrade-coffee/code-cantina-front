import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'superadmin-table-card',
  template: `
    <section class="">
      <div class="flex flex-col gap-4 mb-6"> 
        <div>
          <h2 class="text-base font-semibold">{{ title }}</h2>
          <p *ngIf="subtitle" class="text-xs opacity-70">{{ subtitle }}</p>
        </div>
        
        <div class="w-full">
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
