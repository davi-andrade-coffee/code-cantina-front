import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminStatus } from '../../models/admin.model';
import { CreateStoreRequest, Store, UpdateStoreRequest } from '../../models/store.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { CreateStoreModalComponent } from '../../components/modals/create-store-modal.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateStoreModalComponent,
    StatusBadgeComponent,
    TableCardComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDetailPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admin = signal<Admin | null>(null);
  readonly stores = signal<Store[]>([]);
  readonly modalLojaAberto = signal(false);
  readonly modalLojaModo = signal<'CRIAR' | 'EDITAR'>('CRIAR');
  readonly lojaSelecionada = signal<Store | null>(null);

  constructor() {
    this.carregarDetalhes();
  }

  carregarDetalhes(): void {
    const adminId = this.route.snapshot.paramMap.get('adminId');
    if (!adminId) {
      this.errorMsg.set('Admin não encontrado.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.facade
      .getAdminById(adminId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (admin) => this.admin.set(admin ?? null),
        error: () => this.errorMsg.set('Falha ao carregar dados do Admin.'),
      });

    this.facade
      .listAdminStores(adminId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stores) => this.stores.set(stores),
        error: () => this.errorMsg.set('Falha ao carregar lojas vinculadas.'),
      });
  }

  abrirNovaLoja(): void {
    this.modalLojaModo.set('CRIAR');
    this.lojaSelecionada.set(null);
    this.modalLojaAberto.set(true);
  }

  abrirEditarLoja(store: Store): void {
    this.modalLojaModo.set('EDITAR');
    this.lojaSelecionada.set(store);
    this.modalLojaAberto.set(true);
  }

  fecharNovaLoja(): void {
    this.modalLojaAberto.set(false);
    this.lojaSelecionada.set(null);
  }

  confirmarNovaLoja(payload?: (UpdateStoreRequest & { id?: string | null }) | undefined): void {
    const adminId = this.admin()?.id;
    if (payload?.id) {
      this.facade
        .updateStore(payload.id, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.stores.update((lista) =>
              lista.map((item) =>
                item.id === payload.id
                  ? {
                      ...item,
                      nome: payload.nome,
                      cnpj: payload.cnpj,
                      mensalidade: payload.mensalidade,
                      vencimento: payload.vencimento,
                    }
                  : item
              )
            );
          },
          error: () => this.errorMsg.set('Não foi possível atualizar a loja.'),
        });
    } else if (payload && adminId) {
      const createRequest: CreateStoreRequest = { ...payload, adminId };
      this.facade
        .createStore(createRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.carregarDetalhes(),
          error: () => this.errorMsg.set('Não foi possível cadastrar a loja.'),
        });
    }
    this.modalLojaAberto.set(false);
    this.lojaSelecionada.set(null);
  }


  onAdminStatusChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.toggleAdminStatus(target?.checked ?? false);
  }

  onStoreStatusChange(store: Store, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.toggleStoreStatus(store, target?.checked ?? false);
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

  toggleAdminStatus(ativo: boolean): void {
    const admin = this.admin();
    if (!admin) return;
    const status: AdminStatus = ativo ? 'ATIVO' : 'BLOQUEADO';
    this.facade
      .updateAdminStatus(admin.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.admin.set({ ...admin, status });
        },
        error: () => this.errorMsg.set('Não foi possível atualizar o status do Admin.'),
      });
  }
}
