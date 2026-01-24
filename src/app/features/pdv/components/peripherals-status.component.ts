import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface PeripheralStatus {
  id: string;
  label: string;
  status: 'ONLINE' | 'OFFLINE';
  icon: string;
}

@Component({
  selector: 'pdv-peripherals-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">Status</div>
        <div class="badge badge-outline">Periféricos</div>
      </div>
      <div class="text-xs opacity-70">Nenhuma venda em andamento</div>

      <div class="space-y-2">
        <div
          *ngFor="let item of items"
          class="flex items-center gap-3 rounded-lg border border-error/40 bg-base-200 px-3 py-2"
        >
          <div class="text-error text-lg">{{ item.icon }}</div>
          <div>
            <div class="text-sm font-semibold text-error">{{ item.label }}</div>
            <div class="text-xs text-error/80">{{ item.status === 'OFFLINE' ? 'Offline' : 'Online' }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PeripheralsStatusComponent {
  @Input() items: PeripheralStatus[] = [];
}
