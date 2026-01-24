import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientTableComponent } from '../../components/client-table.component';
import { DependentSelectorComponent } from '../../components/dependent-selector.component';
import { StatementDetailModalComponent } from '../../components/statement-detail-modal.component';
import { SummaryCardComponent } from '../../components/summary-card.component';
import { StatementEntry } from '../../models/statement.model';
import { ClientFacade } from '../../services/client.facade';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DependentSelectorComponent,
    SummaryCardComponent,
    ClientTableComponent,
    StatementDetailModalComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold">Extrato</h2>
        <p class="text-sm opacity-70">Movimentações e compras filtradas por período.</p>
      </div>
      <client-dependent-selector
        [people]="people()"
        [selectedId]="selectedPerson()?.id || null"
        (selectionChange)="onSelectPerson($event)"
      />
    </div>

    <div class="grid md:grid-cols-4 gap-3 mb-6">
      <label class="form-control">
        <div class="label"><span class="label-text">Data início</span></div>
        <input type="date" class="input input-bordered input-sm" [(ngModel)]="startDate" />
      </label>
      <label class="form-control">
        <div class="label"><span class="label-text">Data fim</span></div>
        <input type="date" class="input input-bordered input-sm" [(ngModel)]="endDate" />
      </label>
      <label class="form-control">
        <div class="label"><span class="label-text">Tipo</span></div>
        <select class="select select-bordered select-sm" [(ngModel)]="typeFilter">
          <option value="">Todos</option>
          <option value="COMPRA">Compras</option>
          <option value="RECARGA">Recargas</option>
          <option value="AJUSTE">Ajustes</option>
        </select>
      </label>
      <label class="form-control">
        <div class="label"><span class="label-text">Texto</span></div>
        <input
          type="text"
          class="input input-bordered input-sm"
          placeholder="Produto ou observação"
          [(ngModel)]="textFilter"
        />
      </label>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 mb-6">
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

    <client-table [empty]="filteredEntries.length === 0">
      <thead>
        <tr>
          <th>Data/Hora</th>
          <th>Origem</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th *ngIf="summary()?.balance !== undefined">Saldo após</th>
          <th class="text-right">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entry of filteredEntries">
          <td>{{ entry.dateTime }}</td>
          <td>{{ entry.origin }}</td>
          <td>{{ entry.description }}</td>
          <td>R$ {{ entry.amount | number: '1.2-2' }}</td>
          <td *ngIf="summary()?.balance !== undefined">
            {{ balanceAfterLabel(entry) }}
          </td>
          <td class="text-right">
            <button class="btn btn-xs btn-ghost" (click)="openDetail(entry)">Ver detalhes</button>
          </td>
        </tr>
      </tbody>
    </client-table>

    <client-statement-detail-modal
      [open]="detailOpen"
      [entry]="selectedEntry"
      (close)="closeDetail()"
    ></client-statement-detail-modal>
  `,
})
export class StatementPage {
  readonly people = this.facade.peopleView;
  readonly selectedPerson = this.facade.selectedPersonView;
  readonly summary = this.facade.statementSummaryView;
  readonly entries = this.facade.statementEntriesView;

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

  onSelectPerson(personId: string): void {
    this.facade.selectPerson(personId);
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
