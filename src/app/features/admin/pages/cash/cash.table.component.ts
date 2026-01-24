import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CashSessionListItem, formatCurrency, formatDateTime } from './cash.models';

@Component({
  selector: 'app-cash-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-base-300 rounded-lg border border-base-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Abertura</th>
              <th>Terminal</th>
              <th>Operador</th>
              <th>Status</th>
              <th>Abertura (R$)</th>
              <th>Esperado (R$)</th>
              <th>Fechamento (R$)</th>
              <th>Diferença (R$)</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="9" class="text-center py-6 text-sm opacity-70">
                Carregando sessões de caixa...
              </td>
            </tr>
            <tr *ngIf="!loading && sessions.length === 0">
              <td colspan="9" class="text-center py-6 text-sm opacity-70">
                Nenhuma sessão encontrada.
              </td>
            </tr>
            <tr
              *ngFor="let session of sessions; trackBy: trackById"
              class="hover"
              (click)="openDetail.emit(session.id)"
            >
              <td>{{ formatDateTime(session.openedAt) }}</td>
              <td>{{ session.terminalName }}</td>
              <td>{{ session.operatorName }}</td>
              <td>
                <span
                  class="badge badge-sm"
                  [ngClass]="{
                    'badge-warning': session.status === 'OPEN',
                    'badge-success': session.status === 'CLOSED'
                  }"
                >
                  {{ session.status === 'OPEN' ? 'Aberta' : 'Fechada' }}
                </span>
              </td>
              <td>{{ formatCurrency(session.openingBalanceCents) }}</td>
              <td>{{ session.status === 'CLOSED' ? formatCurrency(session.expectedCashCents) : '—' }}</td>
              <td>{{ session.status === 'CLOSED' ? formatCurrency(session.closingCashCents) : '—' }}</td>
              <td>
                <ng-container *ngIf="session.status === 'CLOSED'; else dash">
                  <span class="badge badge-sm" [ngClass]="differenceBadge(session.differenceCents)">
                    {{ formatCurrency(session.differenceCents) }}
                  </span>
                </ng-container>
                <ng-template #dash>—</ng-template>
              </td>
              <td class="text-right">
                <button
                  class="btn btn-ghost btn-xs"
                  (click)="onDetails($event, session.id)"
                >
                  Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class CashTableComponent {
  @Input() sessions: CashSessionListItem[] = [];
  @Input() loading = false;

  @Output() openDetail = new EventEmitter<string>();

  formatCurrency(value?: number): string {
    return formatCurrency(value);
  }

  formatDateTime(value?: string): string {
    return formatDateTime(value);
  }

  differenceBadge(value?: number): string {
    if (!value) {
      return 'badge-success';
    }
    return value > 0 ? 'badge-warning' : 'badge-error';
  }

  onDetails(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.openDetail.emit(id);
  }

  trackById(_: number, item: CashSessionListItem): string {
    return item.id;
  }
}
