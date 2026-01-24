import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CashMovementType,
  CashPaymentMethod,
  CashSessionDetail,
  formatCurrency,
  formatDate,
  formatDateTime,
} from './cash.models';

@Component({
  selector: 'app-cash-detail-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog class="modal" [open]="open">
      <div class="modal-box max-w-5xl max-h-[80vh] overflow-y-auto">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-sm opacity-70">
              Sessão de Caixa — {{ detail?.terminal?.name || '—' }}
            </div>
            <h3 class="text-lg font-semibold">{{ detail?.code || 'Detalhes da sessão' }}</h3>
            <div class="flex flex-wrap items-center gap-2 mt-2" *ngIf="detail as detail">
              <span
                class="badge badge-sm"
                [ngClass]="{
                  'badge-warning': detail.status === 'OPEN',
                  'badge-success': detail.status === 'CLOSED'
                }"
              >
                {{ detail.status === 'OPEN' ? 'Aberta' : 'Fechada' }}
              </span>
              <span
                *ngIf="detail.status === 'CLOSED'"
                class="badge badge-sm"
                [ngClass]="detail.summary.differenceCents ? 'badge-error' : 'badge-success'"
              >
                {{ detail.summary.differenceCents ? 'Divergente' : 'OK' }}
              </span>
            </div>
          </div>
          <button class="btn btn-ghost btn-xs" type="button" (click)="close.emit()">Fechar</button>
        </div>

        <div *ngIf="loading" class="py-8 text-sm opacity-70 text-center">
          Carregando detalhes da sessão...
        </div>

        <div *ngIf="error" class="alert alert-error mt-4">
          <span>{{ error }}</span>
        </div>

        <ng-container *ngIf="detail">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div class="bg-base-300 rounded-lg border border-base-100 p-3">
              <div class="text-xs uppercase opacity-60">Terminal</div>
              <div class="text-sm font-semibold">{{ detail.terminal.name }}</div>
            </div>
            <div class="bg-base-300 rounded-lg border border-base-100 p-3">
              <div class="text-xs uppercase opacity-60">Operador</div>
              <div class="text-sm font-semibold">{{ detail.operator.name }}</div>
            </div>
            <div class="bg-base-300 rounded-lg border border-base-100 p-3">
              <div class="text-xs uppercase opacity-60">Data abertura</div>
              <div class="text-sm font-semibold">{{ formatDateTime(detail.openedAt) }}</div>
            </div>
            <div class="bg-base-300 rounded-lg border border-base-100 p-3">
              <div class="text-xs uppercase opacity-60">Data fechamento</div>
              <div class="text-sm font-semibold">
                {{ detail.closedAt ? formatDateTime(detail.closedAt) : '—' }}
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-semibold mb-2">Resumo financeiro</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Abertura (troco)</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.openingBalanceCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Vendas (Dinheiro)</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.salesCashCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Vendas (Saldo/Convênio)</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.salesOtherCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Reforços</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.reinforcementsCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Sangrias</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.withdrawalsCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Esperado (Dinheiro)</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.expectedCashCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Fechamento informado</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.closingCashCents) }}</div>
              </div>
              <div class="bg-base-300 rounded-lg border border-base-100 p-3">
                <div class="text-xs uppercase opacity-60">Diferença</div>
                <div class="text-sm font-semibold">{{ formatCurrency(detail.summary.differenceCents) }}</div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-semibold mb-2">Movimentações do caixa</h4>
            <div class="overflow-x-auto bg-base-300 rounded-lg border border-base-100">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Data/hora</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="detail.movements.length === 0">
                    <td colspan="4" class="text-center py-4 text-sm opacity-70">
                      Nenhuma movimentação registrada.
                    </td>
                  </tr>
                  <tr *ngFor="let movement of detail.movements">
                    <td>{{ formatDateTime(movement.createdAt) }}</td>
                    <td>{{ movementLabel(movement.type) }}</td>
                    <td>{{ formatCurrency(movement.amountCents) }}</td>
                    <td>{{ movement.note || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-semibold mb-2">Vendas da sessão</h4>
            <div class="overflow-x-auto bg-base-300 rounded-lg border border-base-100">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Data/hora</th>
                    <th>Venda</th>
                    <th>Total</th>
                    <th>Forma de pagamento</th>
                    <th>Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="detail.sales.length === 0">
                    <td colspan="5" class="text-center py-4 text-sm opacity-70">
                      Nenhuma venda registrada.
                    </td>
                  </tr>
                  <tr *ngFor="let sale of detail.sales">
                    <td>{{ formatDateTime(sale.createdAt) }}</td>
                    <td>{{ sale.code }}</td>
                    <td>{{ formatCurrency(sale.totalCents) }}</td>
                    <td>{{ paymentLabel(sale.paymentMethod) }}</td>
                    <td>{{ sale.customerName || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="text-xs opacity-60 mt-4">
            Esperado (Dinheiro) representa o valor conferido no caixa físico.
          </div>
        </ng-container>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button (click)="close.emit()">close</button>
      </form>
    </dialog>
  `,
})
export class CashDetailModalComponent {
  @Input() open = false;
  @Input() detail: CashSessionDetail | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() close = new EventEmitter<void>();

  formatCurrency(value?: number): string {
    return formatCurrency(value);
  }

  formatDateTime(value?: string): string {
    return formatDateTime(value);
  }

  formatDate(value?: string): string {
    return formatDate(value);
  }

  movementLabel(type: CashMovementType): string {
    return type === 'WITHDRAWAL' ? 'Sangria' : 'Reforço';
  }

  paymentLabel(method: CashPaymentMethod): string {
    switch (method) {
      case 'CASH':
        return 'Dinheiro';
      case 'WALLET':
        return 'Saldo';
      case 'CONVENIO':
        return 'Convênio';
      case 'MIXED':
        return 'Misto';
      default:
        return method;
    }
  }
}
