import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin } from '../../models/admin.model';
import { Store } from '../../models/store.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';

@Component({
  standalone: true,
  imports: [CommonModule, PaginationComponent, StatusBadgeComponent, TableCardComponent],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly stores = signal<Store[]>([]);
  readonly admins = signal<Admin[]>([]);

  readonly filtros = signal({
    termo: '',
    status: 'TODOS',
    adminId: 'TODOS',
  });

  readonly tamanhosPagina = [6, 8, 12, 16];
  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(8);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.stores().length / this.itensPorPagina()))
  );

  readonly paginaStores = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.stores().slice(inicio, inicio + this.itensPorPagina());
  });

  constructor() {
    this.buscar();
    this.carregarAdmins();
  }

  buscar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    const filtros = this.filtros();

    this.facade
      .listStores({
        termo: filtros.termo,
        status: filtros.status,
        adminId: filtros.adminId === 'TODOS' ? undefined : filtros.adminId,
      })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (stores) => {
          this.stores.set(stores);
          this.paginaAtual.set(1);
        },
        error: () => this.errorMsg.set('Não foi possível carregar as lojas.'),
      });
  }

  carregarAdmins(): void {
    this.facade
      .listAdmins({ termo: '', status: 'TODOS' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (admins) => this.admins.set(admins),
      });
  }

  patchFiltro(patch: Partial<{ termo: string; status: string; adminId: string }>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  alterarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  setItensPorPagina(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }

  toggleStoreStatus(store: Store, ativo: boolean): void {
    const status = ativo ? 'ATIVA' : 'BLOQUEADA';
    this.facade
      .updateStoreStatus(store.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.stores.update((lista) =>
            lista.map((item) => (item.id === store.id ? { ...item, status } : item))
          );
        },
        error: () => this.errorMsg.set('Não foi possível atualizar o status da loja.'),
      });
  }

  adminNome(adminId: string): string {
    return this.admins().find((admin) => admin.id === adminId)?.nome ?? '—';
  }
}
