import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Invoice, InvoiceFilters, InvoiceInsights } from '../../models/invoice.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { KpiCardComponent } from '../../components/kpi-card.component';
import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';

@Component({
  standalone: true,
  imports: [CommonModule, KpiCardComponent, PaginationComponent, StatusBadgeComponent, TableCardComponent],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeTab = signal<'LISTA' | 'INSIGHTS'>('LISTA');
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly invoices = signal<Invoice[]>([]);
  readonly insights = signal<InvoiceInsights | null>(null);

  readonly filtros = signal<InvoiceFilters>({
    competencia: '',
    status: 'TODOS',
    termo: '',
    somenteVencidas: false,
  });

  readonly tamanhosPagina = [6, 8, 12, 16];
  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(8);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.invoices().length / this.itensPorPagina()))
  );

  readonly paginaInvoices = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.invoices().slice(inicio, inicio + this.itensPorPagina());
  });

  constructor() {
    this.buscar();
    this.carregarInsights();
  }

  buscar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.facade
      .listInvoices(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (invoices) => {
          this.invoices.set(invoices);
          this.paginaAtual.set(1);
        },
        error: () => this.errorMsg.set('Não foi possível carregar as faturas.'),
      });
  }

  carregarInsights(): void {
    this.facade
      .getInvoiceInsights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (insights) => this.insights.set(insights),
        error: () => this.errorMsg.set('Falha ao carregar indicadores financeiros.'),
      });
  }

  patchFiltro(patch: Partial<InvoiceFilters>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  alterarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  setItensPorPagina(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }

  formatPercent(value?: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return `${value.toFixed(1)}%`;
  }
}
