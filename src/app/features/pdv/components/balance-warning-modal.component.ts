import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BalanceWarning } from '../services/pdv.facade';

@Component({
  selector: 'pdv-balance-warning-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="warning as data" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="w-full max-w-md rounded-xl bg-base-300 p-6 shadow-xl">
        <h3 class="text-lg font-semibold">Saldo insuficiente</h3>
        <p class="mt-2 text-sm opacity-70">
          O cliente {{ data.customer.name }} não possui limite disponível para esta compra.
        </p>
        <div class="mt-4 space-y-1 text-sm">
          <div class="flex items-center justify-between">
            <span>Saldo disponível</span>
            <span>R$ {{ data.customer.balance | number: '1.2-2' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Total da compra</span>
            <span>R$ {{ data.total | number: '1.2-2' }}</span>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="btn btn-primary" type="button" (click)="close.emit()">Entendi</button>
        </div>
      </div>
    </div>
  `,
})
export class BalanceWarningModalComponent {
  @Input() warning: BalanceWarning | null = null;
  @Output() close = new EventEmitter<void>();
}
