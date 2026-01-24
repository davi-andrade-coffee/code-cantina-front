import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatementDetailModalComponent } from '../../components/statement-detail-modal.component';
import { SummaryCardComponent } from '../../components/summary-card.component';
import { StatementEntry } from '../../models/statement.model';
import { ClientFacade } from '../../services/client.facade';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SummaryCardComponent,
    StatementDetailModalComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold">Extrato</h2>
        <p class="text-sm opacity-70">Movimentações e compras filtradas por período.</p>
      </div>
    </div>

    <section class="bg-base-300 rounded-lg border border-base-100 p-4 space-y-4 mb-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="form-control w-full max-w-[160px]">
          <div class="label"><span class="label-text text-xs opacity-70">Data início</span></div>
          <input type="date" class="input input-bordered input-sm" [(ngModel)]="startDateInput" />
        </label>
        <label class="form-control w-full max-w-[160px]">
          <div class="label"><span class="label-text text-xs opacity-70">Data fim</span></div>
          <input type="date" class="input input-bordered input-sm" [(ngModel)]="endDateInput" />
        </label>
        <label class="form-control w-full max-w-[180px]">
          <div class="label"><span class="label-text text-xs opacity-70">Tipo</span></div>
          <select class="select select-bordered select-sm" [(ngModel)]="typeFilterInput">
            <option value="">Todos</option>
            <option value="COMPRA">Compras</option>
            <option value="RECARGA">Recargas</option>
            <option value="AJUSTE">Ajustes</option>
          </select>
        </label>
        <label class="form-control w-full max-w-sm">
          <div class="label"><span class="label-text text-xs opacity-70">Texto</span></div>
          <input
            type="text"
            class="input input-bordered input-sm"
            placeholder="Produto ou observação"
            [(ngModel)]="textFilterInput"
          />
        </label>
        <button class="btn btn-primary btn-sm mt-6" (click)="applyFilters()">Buscar</button>
      </div>

      <div class="grid lg:grid-cols-3 gap-4">
        <client-summary-card
          title="Cliente + Plano"
          [value]="summary()?.clientName || '—'"
          [subtitle]="summary()?.planLabel || ''"
        ></client-summary-card>

        <client-summary-card
          *ngIf="summary()?.balance !== undefined"
          title="Saldo atual"
          [value]="balanceValue"
          subtitle="Saldo disponível"
        ></client-summary-card>

        <client-summary-card
          title="Consumo no período"
          [value]="periodConsumption"
          subtitle="Total no período filtrado"
        ></client-summary-card>
      </div>
    </section>

    <section class="bg-base-300 rounded-lg border border-base-100 p-4 space-y-4">
      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th class="text-center">Data/Hora</th>
              <th class="text-center">Origem</th>
              <th class="text-center">Descrição</th>
              <th class="text-center">Valor</th>
              <th class="text-center" *ngIf="summary()?.balance !== undefined">Saldo após</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of filteredEntries">
              <td class="text-center">{{ entry.dateTime }}</td>
              <td class="text-center">{{ entry.origin }}</td>
              <td class="text-center">{{ entry.description }}</td>
              <td class="text-center">R$ {{ entry.amount | number: '1.2-2' }}</td>
              <td class="text-center" *ngIf="summary()?.balance !== undefined">
                {{ balanceAfterLabel(entry) }}
              </td>
              <td class="text-center">
                <button class="btn btn-xs btn-outline" (click)="openDetail(entry)">Ver detalhes</button>
              </td>
            </tr>
            <tr *ngIf="filteredEntries.length === 0">
              <td
                [attr.colspan]="summary()?.balance !== undefined ? 6 : 5"
                class="text-center opacity-70 py-6"
              >
                Nenhuma movimentação encontrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between text-sm opacity-70">
        <span>Mostrando {{ filteredEntries.length }} registros</span>
        <div class="join">
          <button class="btn btn-xs join-item">«</button>
          <button class="btn btn-xs join-item">1</button>
          <button class="btn btn-xs join-item">2</button>
          <button class="btn btn-xs join-item">»</button>
        </div>
      </div>
    </section>

    <client-statement-detail-modal
      [open]="detailOpen"
      [entry]="selectedEntry"
      (close)="closeDetail()"
    ></client-statement-detail-modal>
  `,
})
export class StatementPage {
  readonly summary = this.facade.statementSummaryView;
  readonly entries = this.facade.statementEntriesView;

  startDateInput = '';
  endDateInput = '';
  typeFilterInput = '';
  textFilterInput = '';

  startDate = '';
  endDate = '';
  typeFilter = '';
  textFilter = '';

  detailOpen = false;
  selectedEntry: StatementEntry | null = null;

  constructor(private facade: ClientFacade) {}

  get balanceValue(): string {
    const balance = this.summary()?.balance ?? 0;
    return `R$ ${balance.toFixed(2)}`;
  }

  get periodConsumption(): string {
    const total = this.summary()?.periodConsumption ?? 0;
    return `R$ ${total.toFixed(2)}`;
  }

  get filteredEntries(): StatementEntry[] {
    const query = this.textFilter.toLowerCase().trim();
    return this.entries().filter(entry => {
      if (this.typeFilter && entry.type !== this.typeFilter) return false;
      if (this.startDate && entry.dateTime.slice(0, 10) < this.startDate) return false;
      if (this.endDate && entry.dateTime.slice(0, 10) > this.endDate) return false;
      if (query) {
        const haystack = `${entry.description} ${entry.detail?.items.map(item => item.name).join(' ')}`
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }

  applyFilters(): void {
    this.startDate = this.startDateInput;
    this.endDate = this.endDateInput;
    this.typeFilter = this.typeFilterInput;
    this.textFilter = this.textFilterInput;
  }

  openDetail(entry: StatementEntry): void {
    this.selectedEntry = entry;
    this.detailOpen = true;
  }

  closeDetail(): void {
    this.detailOpen = false;
    this.selectedEntry = null;
  }

  balanceAfterLabel(entry: StatementEntry): string {
    if (entry.balanceAfter === null || entry.balanceAfter === undefined) return '—';
    return `R$ ${entry.balanceAfter.toFixed(2)}`;
  }
}
