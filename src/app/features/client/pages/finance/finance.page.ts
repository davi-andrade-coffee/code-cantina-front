import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceDetailModalComponent } from '../../components/finance-detail-modal.component';
import { SummaryCardComponent } from '../../components/summary-card.component';
import { FinanceHistoryItem, InvoiceHistoryItem, InvoiceStatus } from '../../models/finance.model';
import { ClientFacade } from '../../services/client.facade';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SummaryCardComponent,
    FinanceDetailModalComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold">Financeiro</h2>
        <p class="text-sm opacity-70">Recargas, faturas e histórico financeiro.</p>
      </div>
    </div>

    <div class="grid gap-4 mb-8">
      <client-summary-card
        *ngIf="isWallet"
        title="Adicionar saldo"
        [value]="walletValue"
        subtitle="Gerar cobrança simplificada"
      >
        <div class="grid gap-3">
          <label class="form-control">
            <div class="label"><span class="label-text">Valor (R$)</span></div>
            <input
              type="number"
              min="1"
              class="input input-bordered input-sm"
              [(ngModel)]="topupAmount"
            />
          </label>
          <label class="form-control">
            <div class="label"><span class="label-text">Método</span></div>
            <select class="select select-bordered select-sm" [(ngModel)]="topupMethod">
              <option value="PIX">Pix</option>
              <option value="BOLETO">Boleto</option>
              <option value="COBRANCA">Gerar cobrança</option>
            </select>
          </label>
          <button class="btn btn-primary btn-sm" (click)="submitTopup()">Gerar pagamento</button>
          <div *ngIf="actionMessage" class="text-xs text-success">{{ actionMessage }}</div>
        </div>
      </client-summary-card>

      <client-summary-card
        *ngIf="isInvoice"
        title="Pendências de faturas"
      >
        <div class="grid gap-3">
          <div
            *ngFor="let invoice of pendingInvoices"
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-200 bg-base-100 px-4 py-3"
          >
            <div>
              <div class="text-sm opacity-70">Competência {{ invoice.competency }}</div>
              <div class="text-lg font-semibold">R$ {{ invoice.total | number: '1.2-2' }}</div>
              <div class="text-sm opacity-70">Vencimento {{ invoice.dueDate }}</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="badge badge-sm font-semibold" [ngClass]="statusBadgeClass(invoice.status)">
                {{ invoiceStatusLabel(invoice.status) }}
              </span>
              <button class="btn btn-sm btn-outline" (click)="openDetail(invoice)">Detalhar</button>
            </div>
          </div>
          <div *ngIf="pendingInvoices.length === 0" class="text-sm opacity-70">
            Nenhuma pendência em aberto no momento.
          </div>
        </div>
      </client-summary-card>
    </div>

    <section class="bg-base-300 rounded-lg border border-base-100 p-4 space-y-4">
      <div>
        <h3 class="text-lg font-semibold">Histórico financeiro</h3>
      </div>
      <div class="flex flex-wrap items-end gap-3">
        <label class="form-control w-full max-w-[160px]">
          <div class="label"><span class="label-text text-xs opacity-70">Período</span></div>
          <input type="date" class="input input-bordered input-sm" [(ngModel)]="startDateInput" />
        </label>
        <label class="form-control w-full max-w-[160px]">
          <div class="label"><span class="label-text text-xs opacity-70">Até</span></div>
          <input type="date" class="input input-bordered input-sm" [(ngModel)]="endDateInput" />
        </label>
        <label class="form-control w-full max-w-[180px]">
          <div class="label"><span class="label-text text-xs opacity-70">Status</span></div>
          <select class="select select-bordered select-sm" [(ngModel)]="statusFilterInput">
            <option value="">Todos</option>
            <option value="EM_ABERTO">Em aberto</option>
            <option value="QUITADO">Quitado</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </label>
        <label class="form-control w-full max-w-[180px]" *ngIf="isWallet">
          <div class="label"><span class="label-text text-xs opacity-70">Tipo</span></div>
          <select class="select select-bordered select-sm" [(ngModel)]="movementFilterInput">
            <option value="">Todos</option>
            <option value="RECARGA">Recarga</option>
            <option value="ESTORNO">Estorno</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
        </label>
        <button class="btn btn-primary btn-sm mt-6" (click)="applyFilters()">Buscar</button>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th class="text-center">Competência/Data</th>
              <th class="text-center">Valor</th>
              <th class="text-center">Vencimento/Tipo</th>
              <th class="text-center">Status</th>
              <th class="text-center">Pago em</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredHistory">
              <td class="text-center">
                <span *ngIf="item.type === 'INVOICE'">{{ item.competency }}</span>
                <span *ngIf="item.type === 'TRANSACTION'">{{ item.date }}</span>
              </td>
              <td class="text-center">R$ {{ historyAmount(item) | number: '1.2-2' }}</td>
              <td class="text-center">
                <span *ngIf="item.type === 'INVOICE'">{{ item.dueDate }}</span>
                <span *ngIf="item.type === 'TRANSACTION'">{{ item.movement }}</span>
              </td>
              <td class="text-center">
                <span
                  class="badge badge-sm font-semibold"
                  [ngClass]="statusBadgeClass(statusKeyForItem(item))"
                >
                  {{ statusLabelForItem(item) }}
                </span>
              </td>
              <td class="text-center">
                <span *ngIf="item.type === 'INVOICE'">{{ item.paidAt || '—' }}</span>
                <span *ngIf="item.type === 'TRANSACTION'">—</span>
              </td>
              <td class="text-center">
                <button class="btn btn-xs btn-outline" (click)="openDetail(item)">Detalhar</button>
              </td>
            </tr>
            <tr *ngIf="filteredHistory.length === 0">
              <td colspan="6" class="text-center opacity-70 py-6">
                Nenhum registro encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between text-sm opacity-70">
        <span>Mostrando {{ filteredHistory.length }} registros</span>
        <div class="join">
          <button class="btn btn-xs join-item">«</button>
          <button class="btn btn-xs join-item">1</button>
          <button class="btn btn-xs join-item">2</button>
          <button class="btn btn-xs join-item">»</button>
        </div>
      </div>
    </section>

    <client-finance-detail-modal
      [open]="detailOpen"
      [item]="selectedItem"
      (close)="closeDetail()"
    ></client-finance-detail-modal>
  `,
})
export class FinancePage {
  readonly financeSummary = this.facade.financeSummaryView;
  readonly financeHistory = this.facade.financeHistoryView;
  readonly actionState = this.facade.actionState;

  topupAmount = 50;
  topupMethod: 'PIX' | 'BOLETO' | 'COBRANCA' = 'PIX';
  startDateInput = '';
  endDateInput = '';
  statusFilterInput = '';
  movementFilterInput = '';

  startDate = '';
  endDate = '';
  statusFilter = '';
  movementFilter = '';

  detailOpen = false;
  selectedItem: FinanceHistoryItem | null = null;

  constructor(private facade: ClientFacade) {}

  get isWallet(): boolean {
    return this.financeSummary()?.planType === 'SALDO';
  }

  get isInvoice(): boolean {
    return this.financeSummary()?.planType === 'CONVENIO';
  }

  get walletValue(): string {
    const balance = this.financeSummary()?.balance ?? 0;
    return `Saldo disponível: R$ ${balance.toFixed(2)}`;
  }

  get actionMessage(): string {
    const state = this.actionState();
    return state.status === 'success' ? state.message ?? '' : '';
  }

  get pendingInvoices(): InvoiceHistoryItem[] {
    return this.financeHistory().filter(
      (item): item is InvoiceHistoryItem => item.type === 'INVOICE' && item.status !== 'QUITADO'
    );
  }

  get filteredHistory(): FinanceHistoryItem[] {
    const items = this.financeHistory();
    return items.filter(item => {
      if (this.statusFilter) {
        if (this.statusKeyForItem(item) !== this.statusFilter) return false;
      }
      if (this.movementFilter && item.type === 'TRANSACTION' && item.movement !== this.movementFilter) {
        return false;
      }
      if (this.startDate) {
        const dateValue = item.type === 'INVOICE' ? item.dueDate : item.date;
        if (dateValue < this.startDate) return false;
      }
      if (this.endDate) {
        const dateValue = item.type === 'INVOICE' ? item.dueDate : item.date;
        if (dateValue > this.endDate) return false;
      }
      return true;
    });
  }

  submitTopup(): void {
    if (!this.topupAmount || this.topupAmount <= 0) return;
    this.facade.createTopup(this.topupAmount);
  }

  applyFilters(): void {
    this.startDate = this.startDateInput;
    this.endDate = this.endDateInput;
    this.statusFilter = this.statusFilterInput;
    this.movementFilter = this.movementFilterInput;
  }

  openDetail(item: FinanceHistoryItem): void {
    this.selectedItem = item;
    this.detailOpen = true;
  }

  closeDetail(): void {
    this.detailOpen = false;
    this.selectedItem = null;
  }

  historyAmount(item: FinanceHistoryItem): number {
    return item.type === 'INVOICE' ? item.total : item.amount;
  }

  invoiceStatusLabel(status: InvoiceStatus): string {
    return status === 'QUITADO' ? 'Quitado' : status === 'VENCIDO' ? 'Vencido' : 'Em aberto';
  }

  statusKeyForItem(item: FinanceHistoryItem): InvoiceStatus {
    if (item.type === 'INVOICE') return item.status;
    if (item.status === 'CONCLUIDA') return 'QUITADO';
    if (item.status === 'FALHOU') return 'VENCIDO';
    return 'EM_ABERTO';
  }

  statusLabelForItem(item: FinanceHistoryItem): string {
    return this.invoiceStatusLabel(this.statusKeyForItem(item));
  }

  statusBadgeClass(status: InvoiceStatus): string {
    if (status === 'QUITADO') return 'badge-success';
    if (status === 'VENCIDO') return 'badge-error';
    return 'badge-warning';
  }
}
