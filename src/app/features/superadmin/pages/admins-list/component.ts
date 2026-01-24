import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminFilters, AdminInsights } from '../../models/admin.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { BlockModalComponent } from '../../components/modals/block-modal.component';
import { CreateAdminModalComponent } from '../../components/modals/create-admin-modal.component';
import { KpiCardComponent } from '../../components/kpi-card.component';
import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlockModalComponent,
    CreateAdminModalComponent,
    KpiCardComponent,
    PaginationComponent,
    StatusBadgeComponent,
    TableCardComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeTab = signal<'LISTA' | 'INSIGHTS'>('LISTA');
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admins = signal<Admin[]>([]);
  readonly insights = signal<AdminInsights | null>(null);

  readonly filtros = signal<AdminFilters>({
    termo: '',
    status: 'TODOS',
    somenteInadimplentes: false,
  });

  readonly tamanhosPagina = [6, 8, 12, 16];
  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(8);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.admins().length / this.itensPorPagina()))
  );

  readonly paginaAdmins = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.admins().slice(inicio, inicio + this.itensPorPagina());
  });

  readonly modalBloqueioAberto = signal(false);
  readonly modalCadastroAberto = signal(false);
  readonly adminSelecionado = signal<Admin | null>(null);

  constructor() {
    this.buscar();
    this.carregarInsights();
  }

  buscar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.facade
      .listAdmins(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (admins) => {
          this.admins.set(admins);
          this.paginaAtual.set(1);
        },
        error: () => this.errorMsg.set('Não foi possível carregar os Admins.'),
      });
  }

  carregarInsights(): void {
    this.facade
      .getAdminInsights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (insights) => this.insights.set(insights),
        error: () => this.errorMsg.set('Falha ao carregar os indicadores.'),
      });
  }

  patchFiltro(patch: Partial<AdminFilters>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  alterarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  setItensPorPagina(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }

  abrirBloqueio(admin: Admin): void {
    this.adminSelecionado.set(admin);
    this.modalBloqueioAberto.set(true);
  }

  fecharBloqueio(): void {
    this.modalBloqueioAberto.set(false);
    this.adminSelecionado.set(null);
  }

  confirmarBloqueio(): void {
    this.modalBloqueioAberto.set(false);
  }

  abrirCadastro(): void {
    this.modalCadastroAberto.set(true);
  }

  fecharCadastro(): void {
    this.modalCadastroAberto.set(false);
  }

  confirmarCadastro(): void {
    this.modalCadastroAberto.set(false);
  }

  formatPercent(value?: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return `${value.toFixed(1)}%`;
  }
}
