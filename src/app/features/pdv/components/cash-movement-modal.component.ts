import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashMovementType } from '../models/cash-movement';

@Component({
  selector: 'pdv-cash-movement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-lg bg-base-300 p-6 shadow-xl">
        <div class="text-lg font-semibold mb-2">
          {{ type === 'SANGRIA' ? 'Registrar sangria' : 'Registrar reforço' }}
        </div>
        <div class="text-sm opacity-70 mb-4">Informe o valor e observações.</div>

        <label class="form-control w-full mb-3">
          <div class="label">
            <span class="label-text">Valor (R$)</span>
          </div>
          <input
            class="input input-bordered"
            type="number"
            min="0.01"
            step="0.01"
            [(ngModel)]="amount"
          />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Observação</span>
          </div>
          <textarea class="textarea textarea-bordered" rows="3" [(ngModel)]="note"></textarea>
        </label>

        <div class="mt-6 flex items-center justify-end gap-2">
          <button class="btn btn-ghost" type="button" (click)="cancel.emit()">Cancelar</button>
          <button
            class="btn btn-primary"
            type="button"
            (click)="submit()"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CashMovementModalComponent {
  @Input() open = false;
  @Input() type: CashMovementType = 'SANGRIA';
  @Output() save = new EventEmitter<{ amount: number; note?: string }>();
  @Output() cancel = new EventEmitter<void>();

  amount = 0;
  note = '';

  submit(): void {
    this.save.emit({ amount: this.amount, note: this.note || undefined });
    this.amount = 0;
    this.note = '';
  }
}
