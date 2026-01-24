import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DependentSelectorComponent } from '../../components/dependent-selector.component';
import { SummaryCardComponent } from '../../components/summary-card.component';
import { ClientFacade } from '../../services/client.facade';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, DependentSelectorComponent, SummaryCardComponent],
  template: `
    <div class="flex items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold">Painel do Cliente</h2>
        <p class="text-sm opacity-70">Resumo do plano, pagamentos e consumo atual.</p>
      </div>
      <client-dependent-selector
        [people]="people()"
        [selectedId]="selectedPerson()?.id || null"
        (selectionChange)="onSelectPerson($event)"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <client-summary-card
        title="Plano atual"
        [value]="planLabel"
        [badge]="planStatus"
        [subtitle]="planLimit"
      >
        <div class="text-xs opacity-70">Acompanhe o status do seu vínculo.</div>
      </client-summary-card>

      <client-summary-card
        *ngIf="isWallet"
        title="Saldo atual"
        [value]="balanceValue"
        [subtitle]="lastTopup"
      >
        <a class="btn btn-sm btn-primary" [routerLink]="'/cliente/finance'">
          Adicionar saldo
        </a>
      </client-summary-card>

      <client-summary-card
        *ngIf="isInvoice"
        title="Fatura do mês"
        [value]="invoiceValue"
        [subtitle]="invoiceSubtitle"
        [badge]="invoiceStatus"
      >
        <a class="btn btn-sm btn-primary" [routerLink]="'/cliente/finance'">
          Ver fatura / Baixar boleto
        </a>
      </client-summary-card>

      <client-summary-card
        title="Consumo do mês"
        [value]="consumptionValue"
        [subtitle]="consumptionSubtitle"
      >
        <a class="btn btn-sm btn-outline" [routerLink]="'/cliente/statement'">
          Ver extrato
        </a>
      </client-summary-card>

      <client-summary-card
        title="Pendências"
        [value]="pendingValue"
        [badge]="pendingBadge"
        [note]="pendingNote"
      >
        <a class="btn btn-sm btn-outline" [routerLink]="'/cliente/finance'">Ir para financeiro</a>
      </client-summary-card>
    </div>
  `,
})
export class DashboardPage {
  readonly people = this.facade.peopleView;
  readonly selectedPerson = this.facade.selectedPersonView;
  readonly dashboard = this.facade.dashboardView;

  constructor(private facade: ClientFacade) {}

  get planLabel(): string {
    const plan = this.dashboard()?.plan;
    if (!plan) return '—';
    return plan.type === 'SALDO' ? 'Saldo / Carteira' : 'Convênio';
  }

  get planStatus(): string {
    const status = this.dashboard()?.plan.status;
    return status === 'BLOQUEADO' ? 'Bloqueado' : 'Ativo';
  }

  get planLimit(): string {
    const limit = this.dashboard()?.plan.monthlyLimit;
    return limit ? `Limite mensal: R$ ${limit.toFixed(2)}` : '';
  }

  get isWallet(): boolean {
    return this.dashboard()?.plan.type === 'SALDO';
  }

  get isInvoice(): boolean {
    return this.dashboard()?.plan.type === 'CONVENIO';
  }

  get balanceValue(): string {
    const balance = this.dashboard()?.balance?.amount ?? 0;
    return `R$ ${balance.toFixed(2)}`;
  }

  get lastTopup(): string {
    const last = this.dashboard()?.balance?.lastTopup;
    if (!last) return 'Última recarga: —';
    return `Última recarga: ${last.date} • R$ ${last.amount.toFixed(2)}`;
  }

  get invoiceValue(): string {
    const invoice = this.dashboard()?.invoice;
    if (!invoice) return '—';
    return `R$ ${invoice.amount.toFixed(2)}`;
  }

  get invoiceSubtitle(): string {
    const invoice = this.dashboard()?.invoice;
    if (!invoice) return '';
    return `Competência ${invoice.competency}`;
  }

  get invoiceStatus(): string {
    const status = this.dashboard()?.invoice?.status;
    if (!status) return '';
    return status === 'QUITADO' ? 'Quitado' : status === 'VENCIDO' ? 'Vencido' : 'Em aberto';
  }

  get consumptionValue(): string {
    const consumption = this.dashboard()?.consumption;
    if (!consumption) return '—';
    return `R$ ${consumption.total.toFixed(2)}`;
  }

  get consumptionSubtitle(): string {
    const consumption = this.dashboard()?.consumption;
    if (!consumption) return '';
    const avg = consumption.averageTicket
      ? ` • Ticket médio R$ ${consumption.averageTicket.toFixed(2)}`
      : '';
    return `${consumption.purchases} compras${avg}`;
  }

  get pendingValue(): string {
    return this.dashboard()?.pending.hasOverdue ? 'Pendências encontradas' : 'Em dia';
  }

  get pendingBadge(): string {
    return this.dashboard()?.pending.hasOverdue ? 'Atraso' : 'OK';
  }

  get pendingNote(): string {
    return this.dashboard()?.pending.message ?? '';
  }

  onSelectPerson(personId: string): void {
    this.facade.selectPerson(personId);
  }
}
