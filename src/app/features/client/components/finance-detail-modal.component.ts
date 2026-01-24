import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FinanceHistoryItem,
  InvoiceHistoryItem,
  WalletTransactionItem,
} from '../models/finance.model';

@Component({
  selector: 'client-finance-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-xl rounded-lg bg-base-300 p-6 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-lg font-semibold">Detalhes da cobrança</div>
            <div class="text-sm opacity-70">
              {{ headerLabel }}
            </div>
          </div>
          <button class="btn btn-sm btn-ghost" (click)="close.emit()">Fechar</button>
        </div>

        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm">Valor</span>
            <span class="font-semibold">R$ {{ amountValue | number: '1.2-2' }}</span>
          </div>
          <div *ngIf="isInvoice" class="flex items-center justify-between">
            <span class="text-sm">Competência</span>
            <span class="font-medium">{{ invoice?.competency }}</span>
          </div>
          <div *ngIf="isInvoice" class="flex items-center justify-between">
            <span class="text-sm">Vencimento</span>
            <span class="font-medium">{{ invoice?.dueDate }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm">Status</span>
            <span class="badge badge-sm font-semibold" [ngClass]="statusBadgeClass">
              {{ statusLabel }}
            </span>
          </div>
          <div *ngIf="isInvoice" class="flex items-center justify-between">
            <span class="text-sm">Pago em</span>
            <span class="font-medium">{{ invoice?.paidAt || '—' }}</span>
          </div>
          <div *ngIf="transaction" class="flex items-center justify-between">
            <span class="text-sm">Tipo</span>
            <span class="font-medium">{{ transaction.movement }}</span>
          </div>
          <div *ngIf="transaction" class="flex items-center justify-between">
            <span class="text-sm">Data</span>
            <span class="font-medium">{{ transaction.date }}</span>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <div class="text-sm font-semibold">Ações disponíveis</div>
          <div class="flex flex-wrap gap-2">
            <button *ngIf="showOpenActions" class="btn btn-sm btn-outline">Baixar boleto</button>
            <button *ngIf="showOpenActions" class="btn btn-sm btn-outline">Copiar código</button>
            <button *ngIf="showOverdueActions" class="btn btn-sm btn-outline">
              Solicitar boleto atualizado
            </button>
            <button *ngIf="showOverdueActions" class="btn btn-sm btn-outline">Renegociar</button>
            <button *ngIf="showPaidActions" class="btn btn-sm btn-outline">Baixar nota fiscal</button>
            <button *ngIf="showPaidActions" class="btn btn-sm btn-outline">Ver comprovante</button>
          </div>
          <div class="text-xs opacity-70">
            Para dúvidas, consulte o suporte ou o financeiro da escola.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FinanceDetailModalComponent {
  @Input() open = false;
  @Input() item: FinanceHistoryItem | null = null;
  @Output() close = new EventEmitter<void>();

  get isInvoice(): boolean {
    return this.item?.type === 'INVOICE';
  }

  get invoice(): InvoiceHistoryItem | null {
    return this.item?.type === 'INVOICE' ? this.item : null;
  }

  get transaction(): WalletTransactionItem | null {
    return this.item?.type === 'TRANSACTION' ? this.item : null;
  }

  get headerLabel(): string {
    if (!this.item) return '—';
    if (this.item.type === 'INVOICE') {
      return `Fatura ${this.item.competency}`;
    }
    return `Movimentação ${this.item.date}`;
  }

  get amountValue(): number {
    if (!this.item) return 0;
    return this.item.type === 'INVOICE' ? this.item.total : this.item.amount;
  }

  get statusLabel(): string {
    if (!this.item) return '—';
    if (this.item.type === 'INVOICE') return this.invoiceStatusLabel(this.item.status);
    if (this.item.status === 'CONCLUIDA') return 'Quitado';
    if (this.item.status === 'FALHOU') return 'Vencido';
    return 'Em aberto';
  }

  get statusBadgeClass(): string {
    if (this.statusLabel === 'Quitado') return 'badge-success';
    if (this.statusLabel === 'Vencido') return 'badge-error';
    return 'badge-warning';
  }

  get showOpenActions(): boolean {
    return this.statusLabel === 'Em aberto';
  }

  get showOverdueActions(): boolean {
    return this.statusLabel === 'Vencido';
  }

  get showPaidActions(): boolean {
    return this.statusLabel === 'Quitado';
  }

  private invoiceStatusLabel(status: InvoiceHistoryItem['status']): string {
    return status === 'QUITADO' ? 'Quitado' : status === 'VENCIDO' ? 'Vencido' : 'Em aberto';
  }
}
