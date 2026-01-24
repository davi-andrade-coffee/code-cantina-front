import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from '../models/sale';

@Component({
  selector: 'pdv-payment-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-lg bg-base-300 p-6 shadow-xl">
        <div class="text-lg font-semibold mb-2">Finalizar compra</div>
        <div class="text-sm opacity-70 mb-4">Selecione a forma de pagamento.</div>
        <div class="text-xl font-bold mb-6">Total: R$ {{ total | number: '1.2-2' }}</div>

        <div class="grid gap-2">
          <button class="btn btn-success" type="button" (click)="confirm.emit('DINHEIRO')">
            Dinheiro
          </button>
          <button class="btn btn-info" type="button" (click)="confirm.emit('SALDO')">
            Saldo
          </button>
          <button class="btn btn-outline" type="button" (click)="confirm.emit('CONVENIO')">
            Convênio
          </button>
        </div>

        <div class="mt-6 flex justify-end">
          <button class="btn btn-ghost" type="button" (click)="cancel.emit()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
})
export class PaymentModalComponent {
  @Input() open = false;
  @Input() total = 0;
  @Output() confirm = new EventEmitter<PaymentMethod>();
  @Output() cancel = new EventEmitter<void>();
}
