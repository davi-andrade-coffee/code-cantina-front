import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';
import { Invoice, InvoiceFilters } from '../../models/invoice.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { competenciaToDate, dateToCompetencia } from '../../utils/form-formatters';

@Component({
  standalone: true,
  imports: [CommonModule, PaginationComponent, StatusBadgeComponent, TableCardComponent],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly invoices = signal<Invoice[]>([]);

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

  readonly competenciaData = computed(() => competenciaToDate(this.filtros().competencia));

  constructor() {
    this.buscar();
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

  onCompetenciaChange(value: string): void {
    this.patchFiltro({ competencia: dateToCompetencia(value) });
  }

  patchFiltro(patch: Partial<InvoiceFilters>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }


  onCompetenciaInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.patchFiltro({ competencia: target?.value ?? '' });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.patchFiltro({ status: (target?.value as InvoiceFilters['status']) ?? 'TODOS' });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.patchFiltro({ termo: target?.value ?? '' });
  }

  onOverdueFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.patchFiltro({ somenteVencidas: target?.value === 'SIM' });
  }

  alterarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  setItensPorPagina(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }
}
