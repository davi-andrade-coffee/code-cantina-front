import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pdv-sale-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between text-sm opacity-80">
        <span>Subtotal</span>
        <span>R$ {{ subtotal | number: '1.2-2' }}</span>
      </div>
      <div class="flex items-center justify-between text-sm opacity-80">
        <span>Descontos</span>
        <span>R$ 0,00</span>
      </div>
      <div class="divider my-1"></div>
      <div class="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>R$ {{ total | number: '1.2-2' }}</span>
      </div>
    </div>
  `,
})
export class SaleSummaryComponent {
  @Input() subtotal = 0;
  @Input() total = 0;
}
