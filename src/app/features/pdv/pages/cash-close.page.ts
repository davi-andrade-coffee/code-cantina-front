import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashSessionSummary } from '../services/pdv.facade';

@Component({
  selector: 'pdv-cash-close',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rounded-lg border border-base-200 bg-base-300 p-6">
      <h2 class="text-lg font-semibold">Fechamento de Caixa</h2>
      <p class="text-sm opacity-70 mb-6">Confira o resumo da sessão antes de fechar.</p>

      <div *ngIf="summary" class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Abertura</span>
            <span>R$ {{ summary.openingBalance | number: '1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Vendas (Dinheiro)</span>
            <span>R$ {{ summary.salesByPayment.DINHEIRO | number: '1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Vendas (Saldo)</span>
            <span>R$ {{ summary.salesByPayment.SALDO | number: '1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Vendas (Convênio)</span>
            <span>R$ {{ summary.salesByPayment.CONVENIO | number: '1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Sangria</span>
            <span>- R$ {{ summary.totalSangria | number: '1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Reforço</span>
            <span>R$ {{ summary.totalReforco | number: '1.2-2' }}</span>
          </div>
          <div class="divider my-2"></div>
          <div class="flex justify-between font-semibold">
            <span>Esperado</span>
            <span>R$ {{ summary.expectedBalance | number: '1.2-2' }}</span>
          </div>
        </div>

        <div>
          <label class="form-control w-full mb-3">
            <div class="label">
              <span class="label-text">Valor contado (R$)</span>
            </div>
            <input class="input input-bordered" type="number" min="0" step="0.01" [(ngModel)]="counted" />
          </label>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Observação</span>
            </div>
            <textarea class="textarea textarea-bordered" rows="3" [(ngModel)]="note"></textarea>
          </label>

          <div class="mt-4 text-sm" *ngIf="summary">
            Divergência: R$ {{ (counted - summary.expectedBalance) | number: '1.2-2' }}
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button class="btn btn-ghost" type="button" (click)="cancel.emit()">Voltar</button>
        <button class="btn btn-primary" type="button" (click)="submit()">Fechar Caixa</button>
      </div>
    </section>
  `,
})
export class CashClosePage {
  @Input() summary: CashSessionSummary | null = null;
  @Output() close = new EventEmitter<{ counted: number; note?: string }>();
  @Output() cancel = new EventEmitter<void>();

  counted = 0;
  note = '';

  submit(): void {
    this.close.emit({ counted: this.counted, note: this.note || undefined });
  }
}
