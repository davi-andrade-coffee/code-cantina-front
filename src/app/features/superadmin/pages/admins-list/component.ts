import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminFilters, AdminStatus } from '../../models/admin.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { CreateAdminModalComponent } from '../../components/modals/create-admin-modal.component';
import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateAdminModalComponent,
    PaginationComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admins = signal<Admin[]>([]);

  readonly filtros = signal<AdminFilters>({
    termo: '',
    status: 'TODOS',
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

  readonly modalCadastroAberto = signal(false);

  constructor() {
    this.buscar();
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

  abrirCadastro(): void {
    this.modalCadastroAberto.set(true);
  }

  fecharCadastro(): void {
    this.modalCadastroAberto.set(false);
  }

  confirmarCadastro(): void {
    this.modalCadastroAberto.set(false);
  }

  toggleAdminStatus(admin: Admin, ativo: boolean): void {
    const status: AdminStatus = ativo ? 'ATIVO' : 'BLOQUEADO';
    this.facade
      .updateAdminStatus(admin.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          if (!updated) return;
          this.admins.update((lista) =>
            lista.map((item) => (item.id === updated.id ? updated : item))
          );
        },
        error: () => this.errorMsg.set('Não foi possível atualizar o status do Admin.'),
      });
  }
}
